
//Cria a conecção
var conn = new WebSocket('ws://localhost:8008');

//Abre a conexão
conn.onopen = function(e) {
    //console.log(e.data);
    console.log("Connection Estabelecida!");
};

//Recebe a Mensagem
conn.onmessage = function(e) {
    console.log(e.data);
    //showMessagesRec('other', e.data);

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

btn_env.addEventListener('click', function(){
    
    //Parâmetros do WS
    $tipo_ws = sel_servico.value; //Utilizar uma Variável do SC para preencher essa var dinamicamente
    $param_ws = '';    
    switch ($tipo_ws) {
        case 'EnvioNotaVMais':
            $param_ws = {'BackJob_Id': inp_jobid.value,'conexao': inp_con64.value}; //Preencher o Array com os dados de acesso ao WS
            $param_ws = JSON.stringify($param_ws);
            break;

        default:            
            break;
    }

    if ($tipo_ws != '')
    {
        //Monta os Dados da Mensagem - Parâmetros de Chamada do WS Notalize
        $str_link = inp_sitecli.value + "/" + sel_servico.value;
        $str_env = {'tipo': $tipo_ws, 'link_cli': $str_link, 'param_ws': $param_ws};    
        $msg_env = JSON.stringify($str_env); //Converte pra JSON

        //console.log($msg_env);

        //Envia a Mensagem
        conn.send($msg_env);

        showMessagesEnv('me', $msg_env);
    }
    else
    {
        var edata = '{"BackJob_Finalizou":"R","Messages":[{"Id":"ErroWS","Type":1,"Description":"Selecione um Serviço!"}]}';
        //edata = JSON.stringify(edata);
        showMessagesRec('other', edata);
    }

});

function showMessagesEnv(how, data) {
    data = JSON.parse(data);

    //console.log(data);
    
    var img_src = "assets/imgs/Icon awesome-rocketchat.png";

    var div = document.createElement('div');
    div.setAttribute('class', how);

    var img = document.createElement('img');
    img.setAttribute('src', img_src);

    var div_txt = document.createElement('div');
    div_txt.setAttribute('class', 'text');

    var h5 = document.createElement('h5');
    h5.textContent = data.tipo;

    var pLink = document.createElement('p');
    pLink.textContent = "Link Utilizado: " + data.link_cli;

    var pDados = document.createElement('p');
    pDados.textContent = "Parâmetros Enviados: " + data.param_ws;

    div_txt.appendChild(h5);
    div_txt.appendChild(pLink);
    div_txt.appendChild(pDados);

    div.appendChild(img);
    div.appendChild(div_txt);

    area_content.appendChild(div);
}

function showMessagesRec(how, data) {
    data = JSON.parse(data);
    //console.log(data);
    
    var msgret = JSON.stringify(data.Messages[0]);    
    //console.log(msgret);
    msgret = JSON.parse(msgret);

    var img_src = "assets/imgs/Icon awesome-rocketchat-1.png";

    var div = document.createElement('div');
    div.setAttribute('class', how);

    var img = document.createElement('img');
    img.setAttribute('src', img_src);

    var div_txt = document.createElement('div');
    div_txt.setAttribute('class', 'text');
       
    var h5 = document.createElement('h5');
    h5.textContent = "Retorno do WS: " + msgret.Id;

    var pDados = document.createElement('p');
    pDados.textContent = "Mensagem: " + msgret.Description;

    div_txt.appendChild(h5);
    div_txt.appendChild(pDados);

    div.appendChild(img);
    div.appendChild(div_txt);

    area_content.appendChild(div);    
}
