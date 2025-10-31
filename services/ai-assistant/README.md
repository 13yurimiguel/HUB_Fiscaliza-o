# AI Assistant Service

Serviço FastAPI responsável por orquestrar interações com modelos de linguagem grandes (LLMs) para apoiar auditorias ISO 9001.

## Executando localmente

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```

### Variáveis de ambiente

| Variável | Descrição |
| --- | --- |
| `AI_ASSISTANT_PROVIDER` | `openai`, `azure`, `ollama` ou `mock` (padrão). |
| `OPENAI_API_KEY` | Obrigatória para o provedor `openai`. |
| `OPENAI_MODEL` | Modelo a ser utilizado no provedor OpenAI. |
| `AZURE_OPENAI_API_KEY`, `AZURE_OPENAI_ENDPOINT`, `AZURE_OPENAI_DEPLOYMENT` | Obrigatórias para o provedor `azure`. |
| `OLLAMA_ENDPOINT`, `OLLAMA_MODEL` | Configuração do endpoint Ollama. |
| `AI_ASSISTANT_MEMORY_TTL` | Tempo de retenção da memória de conversa (segundos). |
| `AI_ASSISTANT_MAX_HISTORY` | Número máximo de turnos históricos enviados ao modelo. |

O modo `mock` não necessita de credenciais e retorna respostas determinísticas úteis para desenvolvimento e testes.
