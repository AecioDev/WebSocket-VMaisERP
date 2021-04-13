//Cria a conexão

var link_cli = <?php echo [sys_url_ws]?>; //Obtém o Link do WS Notalize e completa com o /rest
link_cli = link_cli + "/rest";

var server_WS = GetURLServerWS();
server_WS = "ws://" + server_WS;
console.log(link_cli);

var conn = new WebSocket(server_WS); //Configura a Conexão com o Servidor WebSocket em PHP

//Abre a conexão
conn.onopen = function(e) {
    //console.log(e.data);
    console.log("Connection Estabelecida!");
};

/*
//Recebe a Mensagem
conn.onmessage = function(e) {
    //console.log(e.data);
    showMessagesRec('other', e.data);

    conn.close();
};

////////////////////////////////////////////////////

var form1 = document.getElementById('form1');
var inp_jobid = document.getElementById('jobid');
var inp_con64 = document.getElementById('con64');
var inp_sitecli = document.getElementById('sitecli');
var sel_servico = document.getElementById('servico');
var btn_env = document.getElementById('btn1');
var area_content = document.getElementById('content');

ExecutaWS();
*/