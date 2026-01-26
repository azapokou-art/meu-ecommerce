const axios = require('axios');

class CorreiosService {
static async calcularFrete(cepDestino, peso, comprimento, altura, largura, valorDeclarado = 0) {
    try {
    
        return [
            {
                servico: 'PAC',
                codigo: '04510',
                valor: 25.90,
                prazo: 8
            },
            {
                servico: 'SEDEX',
                codigo: '04014', 
                valor: 35.50,
                prazo: 5
            }
        ];
        
    } catch (error) {
        console.error('Erro ao calcular frete:', error);
        return [
            {
                servico: 'PAC',
                codigo: '04510',
                valor: 25.90,
                prazo: 8
            }
        ];
    }
}


    static parseResponse(xmlResponse, nomeServico, codigoServico) {
    try {
     
        if (xmlResponse.includes('Erro')) {
            console.log(`Erro nos Correios para ${nomeServico}:`, xmlResponse);
            return null;
        }

      
        const valorMatch = xmlResponse.match(/<Valor>([^<]+)<\/Valor>/);
        const prazoMatch = xmlResponse.match(/<PrazoEntrega>([^<]+)<\/PrazoEntrega>/);
        const erroMatch = xmlResponse.match(/<Erro>([^<]+)<\/Erro>/);

        if (erroMatch) {
            console.log(`Erro ${nomeServico}:`, erroMatch[1]);
            return null;
        }

        if (valorMatch && prazoMatch) {
            const valor = parseFloat(valorMatch[1].replace(',', '.'));
            const prazo = parseInt(prazoMatch[1]);
            
            return {
                servico: nomeServico,
                codigo: codigoServico,
                valor: valor,
                prazo: prazo
            };
        }

        return null;

    } catch (error) {
        console.error('Erro ao parsear XML:', error);
        return null;
    };
}
}

module.exports = CorreiosService;