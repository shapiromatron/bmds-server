import os


def rename_files(path, old_ext, new_ext, text):
    for root, dirs, files in os.walk(path):
        for file in files:
            if file.endswith(old_ext):
                file_path = os.path.join(root, file)
                with open(file_path) as f:
                    if text in f.read():
                        new_name = file_path.replace(old_ext, new_ext)
                        os.rename(file_path, new_name)


# Example usage
path = "/Users/shapiromatron/dev/bmds-server/frontend"
old_ext = ".js"
new_ext = ".jsx"
text = 'from "react";'
rename_files(path, old_ext, new_ext, text)
