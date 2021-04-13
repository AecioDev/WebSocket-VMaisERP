<?php
    use Ratchet\Server\IoServer;
    use Ratchet\Http\HttpServer;
    use Ratchet\WebSocket\WsServer;
    use ERP\ServiceERP;

    require 'vendor/autoload.php';

    $server = IoServer::factory(
        new HttpServer(
            new WsServer(
                new ServiceERP()
            )
        ),
        8008
    );

    $server->run();