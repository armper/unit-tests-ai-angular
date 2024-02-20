import openai
import os
import json

import re


def call_openai_to_generate_test(component_code, associated_file_content=None, existing_test_code=None):
    # Set the API key
    openai.api_key = os.environ['OPENAI_API_KEY']

    # Create a message for ChatGPT based on whether an existing test code is provided
    if existing_test_code:
        user_message = f'Update the following unit test for the Angular component: {component_code}\nExisting Test:\n{existing_test_code}'
    else:
        user_message = f'Generate a unit test for the following Angular component: {component_code}'

    if associated_file_content:
        user_message += f'\n\nHere is the associated file:\n{associated_file_content}'

    messages = [
        {
            "role": "system",
            "content": "You will be provided with a piece of Angular component code, and your task is to return a complete unit test for that code using Jasmine and Angular testing utilities. Return nothing but the code with no additional text."
        },
        {
            "role": "user",
            "content": user_message
        }
    ]

    # Print the message to be sent to ChatGPT
    print("\nSending to ChatGPT:")
    print("---------------------------------------------")
    print(json.dumps(messages, indent=4).replace('\\n', '\n'))
    print("---------------------------------------------\n")

    # Call ChatGPT
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=messages,
        temperature=0,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0
    )

    # Extract the generated test code from the response
    test_code = response.choices[0].message.content.strip()

    if test_code:
        return test_code
    else:
        print("Failed to generate test code.")
        return None


def extract_and_read_local_imports(ts_file_content, component_path):
    # Regular expression to match local import statements
    import_regex = r"import\s+.*\s+from\s+['\"](.*?)['\"]"
    matches = re.findall(import_regex, ts_file_content)

    # Filter for local files and read their contents
    local_imports_content = {}
    for match in matches:
        if match.startswith('.'):
            # Construct the full path for the local import
            local_import_path = os.path.join(
                os.path.dirname(component_path), match + '.ts')
            if os.path.exists(local_import_path):
                with open(local_import_path, 'r') as file:
                    local_imports_content[match] = file.read()

    return local_imports_content


def generate_tests_for_component(component_path, associated_file_content=None):
    # Determine the base path for the test file
    test_base_path = component_path.replace('.ts', '.spec.ts')

    # Read the component code
    with open(component_path, 'r') as file:
        component_code = file.read()

    # Check if the test file already exists
    existing_test_code = None
    if os.path.exists(test_base_path):
        with open(test_base_path, 'r') as file:
            existing_test_code = file.read()

    # Extract and read contents of local imports
    local_imports_content = extract_and_read_local_imports(
        component_code, component_path)

    # Combine all contents into a single message
    combined_content = component_code
    if associated_file_content:
        combined_content += f"\n\nAssociated HTML file content:\n{associated_file_content}"

    for import_path, import_content in local_imports_content.items():
        combined_content += f"\n\nRelated file ({import_path}): {import_content}"

    # Call OpenAI to generate or update the test code
    test_code = call_openai_to_generate_test(
        combined_content, existing_test_code)

    if test_code is None:
        print(f"Failed to generate test for {component_path}")
        return None

    # Output the generated test code for debugging purposes
    print(f"\nGenerated test code for {component_path}:\n")
    print("--------------------------------------------------")
    print(test_code)
    print("--------------------------------------------------\n")

    # Write the test code to the file
    with open(test_base_path, 'w') as file:
        file.write(test_code)

    # Return the path for use in the Jenkins pipeline
    return test_base_path


# Read the changed files from the file generated earlier in the Jenkins pipeline
with open('changed_files.txt', 'r') as file:
    changed_files = [path.strip() for path in file.readlines()]

# Use sets for efficient membership checking
processed_files = set()

# Iterate through the changed files and generate tests for each Angular component
for component_path in changed_files:
    # Skip if the file is not an Angular .ts file, is a spec.ts file, or has already been processed
    if (not component_path.endswith('.ts') or component_path.endswith('.spec.ts') or component_path in processed_files):
        continue

    associated_file_content = None
    associated_file_path = None

    # Check if there's an associated .html file for the .ts file
    associated_html_path = component_path.replace('.ts', '.html')
    if associated_html_path in changed_files:
        with open(associated_html_path, 'r') as file:
            associated_file_content = file.read()
        associated_file_path = associated_html_path

    # If an associated .html file exists, mark it as processed
    if associated_file_path:
        processed_files.add(associated_file_path)

    # This is where you call generate_tests_for_component
    test_file_path = generate_tests_for_component(
        component_path, associated_file_content)
    if test_file_path:
        # Write the path to a file for use in the Jenkins pipeline
        with open('generated_test_path.txt', 'a') as file:
            file.write(test_file_path + '\n')
