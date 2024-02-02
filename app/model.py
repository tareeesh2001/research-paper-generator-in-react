from transformers import AutoTokenizer, pipeline, logging
from auto_gptq import AutoGPTQForCausalLM, BaseQuantizeConfig
from langchain.chains import LLMChain
from langchain.prompts.prompt import PromptTemplate
from langchain.memory import ConversationBufferMemory
from langchain_community.llms import HuggingFacePipeline
import time
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

model_name_or_path = "TheBloke/Mistral-7B-Instruct-v0.2-GPTQ"
use_triton = False


tokenizer = AutoTokenizer.from_pretrained(model_name_or_path, use_fast=True)

model = AutoGPTQForCausalLM.from_quantized(model_name_or_path,
                                           device_map='auto',                        
                                           use_safetensors=True,
                                           trust_remote_code=True,
                                           use_triton=use_triton,
                                           quantize_config=None)

# logging.set_verbosity(logging.CRITICAL)

pipe = pipeline(
    "text-generation",
    model=model,
    tokenizer=tokenizer,
    do_sample=True,
    max_new_tokens=4096,
    temperature=0.1,
    top_p=0.95,
    top_k=30,
    repetition_penalty=1.15
)
pipe.tokenizer.pad_token_id = model.config.eos_token_id

template = """
[INST] <<SYS>>
You are a helpful, respectful and honest assistant. Always answer as helpfully as possible, while being safe.  Your answers should not include any harmful, unethical, racist, sexist, toxic, dangerous, or illegal content. Please ensure that your responses are socially unbiased and positive in nature. If a question does not make any sense, or is not factually coherent, explain why instead of answering something not correct. If you don't know the answer to a question, please don't share false information.
<</SYS>>
here is the chat history
{chat_history}

{prompt} [/INST]
"""

prompt = PromptTemplate(
    input_variables=["chat_history", "prompt"],
    template=template
)


llm=HuggingFacePipeline(pipeline=pipe)
memory = ConversationBufferMemory(memory_key="chat_history",    k=15,
    return_messages=True)

llm_chain = LLMChain(llm=llm, prompt=prompt, verbose=False,  memory=memory)



def generate_outline(prompt):
    text="Generate an outline consisting of only Headings and Sub-headings of a paper in IEEE format for the topic: " + prompt
    logger.debug("Prompt >> %s", text)
    output=llm_chain.predict(prompt=text)
    return output  


def generate_content_for_heading(heading):
    # Use Mistral model to generate content for a specific heading
    logger.debug("Generating ' %s '", heading)
    heading_prompt = "Generate detailed content for just the heading: "+ heading
    heading_content = llm_chain.predict(prompt=heading_prompt)
    logger.debug("' %s ' generated", heading)
     # Format content with paragraphs
    paragraphs = heading_content.split('\n\n')
    formatted_content = "<p>" + "</p><p>".join(paragraphs) + "</p>"
    return formatted_content