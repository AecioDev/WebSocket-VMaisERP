<?php

function GeraOrctoItem($cod_Pedido)
{
	$script_Orcto = "SELECT  ORC_ID, ORC_CLIENTE, ORC_PROSPECT, ORC_TELEFONE, ORC_CELULAR, ORC_E_MAIL, ORC_ENDERECO, ORC_NUMERO, ORC_BAIRRO, ORC_CEP, ORC_MUNICIPIO, ORC_STATUS, 
						ORC_TOTAL, ORC_DATA, ORC_VENDEDOR, ORC_DATA_ENTREGA, ORC_FORMA_DE_PAGAMENTO, ORC_FORMA_DE_ENTREGA, HOR_ID, ORC_TABELA_DE_PRECOS, ORC_TOTAL_PRODUTOS, 
						ORC_TOTAL_OBRAS, ORC_ENDERECO_ENTREGA, ORC_LOGRADOURO, ORC_TIPO_BAIRRO, ORC_PARCEIRO, ORC_DDD, ORC_TAXA_DE_ENTREGA, ORC_DESCONTO, ORC_TOTAL_FINAL, 
						ORC_DATA_FECHAMENTO, MOL_ID, ORC_DATA_RETIRADA, ORC_ENTREGUE_PARA, ORC_ENTREGUE_POR, ORC_FINAL_DA_PRODUCAO, ORC_INICIO_DA_PRODUCAO, ORC_OBSERVACOES_ENTREGA
					FROM  dbo. QDR_ORCAMENTO";

	sc_lookup(DadosOrcto, $script_Orcto);

	$script_Itens = "SELECT  ORC_ID_ITEM, ORC_PRODUTO, ORC_QUANTIDADE, ORC_VALOR_UNITARIO, ORC_VALOR_TOTAL, ORC_ID_OBRA, ORC_TIPO, ORC_ID, 
						ORC_VALOR_ACRESCIMO, ORC_VALOR_UNITARIO_ACRESCIMO, ORC_NOME_DO_PRODUTO, ORC_SALDO_ESTOQUE, ORC_BUSCA_PRODUTO
					FROM  dbo. QDR_ORCAMENTO_ITENS";

	sc_lookup(DadosItens, $script_Itens);
	
	

}