import json
import os

def load_prompts(type):
    data = ''
    base_path = os.path.dirname(os.path.dirname(__file__))

    with open(os.path.join(base_path, "backend", "prompt_basic.json"), "r", encoding='utf-8') as file:
        prompts = json.load(file)

        data = json.dumps(prompts, ensure_ascii=False, indent=2)

    with open(os.path.join(base_path, "backend", "prompt_type.json"), "r", encoding='utf-8') as file:
        prompts = json.load(file)

        if type == 1:
            data += f"{prompts['general']}\n"
        elif type == 2:
            data += f"{prompts['practical']}\n"
        elif type == 3:
            data += f"{prompts['interpretation']}\n"
        elif type == 4:
            data += f"{prompts['historical']}\n"
        elif type == 5:
            data += f"{prompts['study_guide']}\n"
        elif type == 6:
            data += f"{prompts['devotional']}\n"

    return data