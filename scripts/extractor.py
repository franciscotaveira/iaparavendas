
import sys
import os

def extract_pdf(file_path):
    try:
        import PyPDF2
        with open(file_path, 'rb') as f:
            reader = PyPDF2.PdfReader(f)
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n"
            return text
    except ImportError:
        return "ERROR: PyPDF2 not installed"
    except Exception as e:
        return f"ERROR: {str(e)}"

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python extract.py <file_path>")
        sys.exit(1)
    
    file_path = sys.argv[1]
    if file_path.endswith(".pdf"):
        # Instala dependencia na hora se precisar (Python magic)
        os.system("pip install PyPDF2 > /dev/null 2>&1")
        print(extract_pdf(file_path))
    else:
        with open(file_path, 'r', encoding='utf-8') as f:
            print(f.read())
