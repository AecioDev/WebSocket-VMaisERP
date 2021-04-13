<?php

    namespace ERP;

    use Ratchet\MessageComponentInterface;
    use Ratchet\ConnectionInterface;
    
    class ServiceERP implements MessageComponentInterface 
    {
        protected $clients;
    
        public function __construct() {
            $this->clients = new \SplObjectStorage;
        }
    
        public function onOpen(ConnectionInterface $conn) {
            //Abre a Conexão e Adiciona o Cliente
            $this->clients->attach($conn);
    
            //Mostra no Servidor que um cliente conectou e sua ID
            echo "Cliente({$conn->resourceId}) conectou!\n";
        }
    
        public function onMessage(ConnectionInterface $from, $msg) {
            //$from - Quem Enviou 
            //$msg - Mensagem - um JSON com os parâmetros de comunicação
            
            $param = json_decode($msg, true);    
            
            echo "SRV - Dados Recebidos:\n";
            var_dump($param);

            $tipo_ws  = $param["tipo"];
            $link_cli = $param["link_cli"];
            $param_ws = $param["param_ws"];

            //echo "Tipo: $tipo_ws\nLink: $link_cli\nParam: $param_ws\n\n";

            switch ($tipo_ws) {
                case 'EnvioNotaVMais':    
                    
                    var_dump($param_ws);

                    $ws_Exec = curl_init($link_cli);
                    curl_setopt($ws_Exec, CURLOPT_RETURNTRANSFER, true);
					curl_setopt($ws_Exec, CURLOPT_VERBOSE, true);
                    curl_setopt($ws_Exec, CURLOPT_HTTPHEADER, Array("Content-Type: application/json; charset=utf-8"));
                    curl_setopt($ws_Exec, CURLOPT_POST, true);
                    curl_setopt($ws_Exec, CURLOPT_POSTFIELDS, $param_ws);
                    
                    echo "Aguardando Retorno do WebService: " . $tipo_ws . "\n";
                    $result = curl_exec($ws_Exec);
					$httpCode = curl_getinfo($ws_Exec, CURLINFO_HTTP_CODE);
                                      
                    curl_close($ws_Exec);

                    break;
                
                default:
                    # code...
                    break;
            }
			
			echo "Retorno HTTP: $httpCode\n";            
				
			if($result == ""){
				
				$result = "9999"; //"ERRO WebSocket: Nenhum retorno do Servidor Controller Web!";
				
			} else {
				
				$result = $httpCode . "|" . $result; //"ERRO WebSocket: Erro 500 ao acessar o Servidor Controller Web!";				
			}

            echo "Retorno\n";
            echo $result . "\n";
            
            //$msg_Resp = trim($result); //json_encode($result);

            //Navega nos Clientes
            foreach ($this->clients as $client) {
                if ($from == $client) {

                    // The sender is not the receiver, send to each client connected
                    $client->send($result);
                    //$client->send($msg_Resp);
                }
            }
        }
    
        public function onClose(ConnectionInterface $conn) {
            // The connection is closed, remove it, as we can no longer send it messages
            $this->clients->detach($conn);
    
            echo "Connection {$conn->resourceId} has disconnected\n";
        }
    
        public function onError(ConnectionInterface $conn, \Exception $e) {
            echo "An error has occurred: {$e->getMessage()}\n";
    
            $conn->close();
        }

        
    }