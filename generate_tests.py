import openai
import os


def call_openai_to_generate_test(component_code, existing_test_code=None):
    # Set the API key
    openai.api_key = os.environ['OPENAI_API_KEY']
    print(f"Using API Key: {openai.api_key}")

    # Create a message for ChatGPT based on whether an existing test code is provided
    if existing_test_code:
        user_message = f'Update the following unit test for the Angular component: {component_code}\nExisting Test:\n{existing_test_code}'
    else:
        user_message = f'Generate a unit test for the following Angular component: {component_code}'

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

    # Call ChatGPT
    response = openai.ChatCompletion.create(
        model="gpt-4", messages=messages,
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


def generate_tests_for_component(component_path):
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

    # Call OpenAI to generate or update the test code
    test_code = call_openai_to_generate_test(
        component_code, existing_test_code)

    if test_code is None:
        print(f"Failed to generate test for {component_path}")
        return None

    # Write the test code to the file
    with open(test_base_path, 'w') as file:
        file.write(test_code)

    # Return the path for use in the Jenkins pipeline
    return test_base_path


# Read the changed files from the file generated earlier in the Jenkins pipeline
with open('changed_files.txt', 'r') as file:
    changed_files = file.readlines()

# Iterate through the changed files and generate tests for each Angular component
for component_path in changed_files:
    component_path = component_path.strip()  # Remove newline characters

    # Check if the file is an Angular component and not a test file
    if component_path.endswith('.ts') and not component_path.endswith('.spec.ts'):
        test_file_path = generate_tests_for_component(component_path)
        if test_file_path:
            # Write the path to a file for use in the Jenkins pipeline
            with open('generated_test_path.txt', 'a') as file:
                file.write(test_file_path + '\n')
