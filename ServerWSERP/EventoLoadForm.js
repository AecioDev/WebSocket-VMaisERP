//setTimeout(function(){
//window.location.reload(1);
//}, 5000);

Processar("N"); //Esconde o GIF de processando
	
const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

//Obtém o valor das Variáveis carregadas no onLoad do PHP
var server_WS  = "<?php echo $link_server_WS; ?>";
var vtipentsai = "<?php echo $var_tipentsai; ?>";
var vnroentsai = "<?php echo $var_nroentsai; ?>";
var vidjob     = "<?php echo $var_jobid; ?>";

console.log("ServerWS: " + server_WS);

//Cria a variavel de Conexão com o Servidor WebSocket em PHP
var conn = new WebSocket(server_WS); 

//Abre a conexão
conn.onopen = function(e) {		
    console.log("Conexão Estabelecida!");
};

sleep(2000).then(() => {
    ExecutaWS(conn);
});

//Recebe a Mensagem
conn.onmessage = function(e) {

    console.log(e.data);		
    var DadosRetorno = e.data;
            
    conn.close();

    var RetornoTXT = "";
    var erroWSocket = "N";
    var httpCode = DadosRetorno.substring(0,3);
    
    console.log("HTTP Code: " + httpCode);
    if (httpCode != "200"){
        
        if(DadosRetorno.trim() == "9999"){
            RetornoTXT = "Resposta WS: Nenhum retorno do Servidor Controller Web!";
            erroWSocket = "S";
        } else {
            RetornoTXT = "Resposta WS: " + DadosRetorno.trim();				
            erroWSocket = "S";
        }
    }
    
    if (erroWSocket == "N"){ //Sem Erros internos segue para verificar a tabela History
    
        if (vidjob > 0)	{
            
            var request = $.ajax({
                    url: "../Blank_Consulta_Job_Ajax/Blank_Consulta_Job_Ajax.php",
                    method: "POST",
                    data: { tipentsai : vtipentsai, nroentsai : vnroentsai, idjob : vidjob}
                    //dataType: "json"
                });

            request.done(function( response ) { //Retorna Json com resultado 
                //Verifica a impressão de DANFE pelo código do Estoque
                //Se estoque diferente de F && crystal = "" - Imprime DANFE ou crystal
                //Senão imprime Pedido.
        
                var Ret_Blank = JSON.parse(response);

                if (Ret_Blank.NF_Atualizada == "S") //Nota Atualizada Imprime a Nota
                {									
                    var cmp_Erro = document.getElementById('id_sc_field_erro');
                    cmp_Erro.innerHTML = "Negócio Atualizado com Sucesso!!!\nAguarde a Impressão...";	
                    
                    setTimeout(function(){
                    
                        if (Ret_Blank.estoque == "F" ) //Pedido
                        {
                            //Imprime Pedido
                            ImprimePedido(vnroentsai);
                        }
                        else
                        {	
                            if (Ret_Blank.crystal)
                            {
                                //imprime Crystal
                                var arqCrystal = Ret_Blank.crystal;
                                ImprimeCrystal(arqCrystal, vtipentsai, vnroentsai);
                            }
                            else
                            {
                                //imprime DANFE
                                if (Ret_Blank.danfe)
                                {								
                                    var urlDanfe = Ret_Blank.danfe;			 
                                    window.open(urlDanfe);
                                }
                            }
                        }

                        //Retornar();					
                        nm_saida_glo();	
                        
                    }, 3000);
                }
                else
                {
                    Processar("N");//Esconde o GIF de Processamento
                    
                    //Não Atualizou, apresenta o motivo
                    var cmp_Erro = document.getElementById('id_sc_field_erro');
                    cmp_Erro.innerHTML = Ret_Blank.erro_txt;
                    
                }				

            });

            request.fail(function( jqXHR, textStatus ) {
                alert( "Ops! Não foi possível concluir esta ação: " + textStatus );
            });

        }
    } else {
        
        Processar("N");//Esconde o GIF de Processamento
        
        var cmp_Erro = document.getElementById('id_sc_field_erro');
        cmp_Erro.innerHTML = RetornoTXT;
    }
    
};

function ExecutaWS(){
    Processar("S");

	//Obtém o valor das Variáveis carregadas no onLoad do PHP
	var link_cli = "<?php echo $link_cli; ?>";
	var conexao_64 = "<?php echo $conexao_Base64; ?>";
	var Job_id = "<?php echo $var_jobid; ?>";

	//Parâmetros do WS
	var param_ws = {'BackJob_Id': Job_id,'conexao': conexao_64}; //Preencher o Array com os dados de acesso ao WS
	param_ws = JSON.stringify(param_ws);

	//Monta os Dados da Mensagem - Parâmetros de Chamada do WS Notalize
	var str_link = link_cli + "/EnvioNotaVMais";
	var str_env = {'tipo': "EnvioNotaVMais", 'link_cli': str_link, 'param_ws': param_ws};    
	var msg_env = JSON.stringify(str_env); //Converte pra JSON

	//Envia a Mensagem
	connWS.send(msg_env);
};