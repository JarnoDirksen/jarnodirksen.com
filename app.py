from flask import Flask, render_template, jsonify, request, session, redirect, url_for
import pandas as pd
import os
import hashlib

app = Flask(__name__, static_folder='static', template_folder='templates')
app.secret_key = 'replace_with_secure_random_key'  # Use a strong, random key
app.config['SESSION_COOKIE_SECURE'] = True  # Ensure cookies are sent over HTTPS
app.config['SESSION_COOKIE_HTTPONLY'] = True  # Prevent JavaScript access to cookies

# Hardcoded credentials (replace with secure storage like environment variables or a database)
USERNAME = 'NannoNL'
PASSWORD_HASH = hashlib.sha256('Jrwd2012!'.encode()).hexdigest()

def load_data():
    file_path = os.path.join("excel_files", "TransactionsSummary.xlsx")
    if not os.path.exists(file_path):
        return []
    df = pd.read_excel(file_path)
    df = df.where(pd.notnull(df), None)
    df['Date'] = pd.to_datetime(df['Date'])
    df['Month'] = df['Date'].dt.month
    df['WeekNumber'] = df['Date'].dt.isocalendar().week
    df['Amount'] = pd.to_numeric(df['Amount'], errors='coerce')
    df['Core'] = df['Core'].astype(bool)
    return df.to_dict('records')

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    password_hash = hashlib.sha256(password.encode()).hexdigest()
    if username == USERNAME and password_hash == PASSWORD_HASH:
        session['logged_in'] = True
        return jsonify({'status': 'success'})
    return jsonify({'status': 'error', 'message': 'Invalid credentials'}), 401

@app.route('/api/logout', methods=['POST'])
def logout():
    session.pop('logged_in', None)
    return jsonify({'status': 'success'})

@app.route('/api/data', methods=['GET'])
def get_data():
    if not session.get('logged_in'):
        return jsonify({'status': 'error', 'message': 'Unauthorized'}), 401
    data = load_data()
    return jsonify({'status': 'success', 'data': data})

# Optional: Serve login.html for fallback (not used in website)
@app.route('/login')
def login_page():
    return render_template('login.html')

if __name__ == '__main__':
    app.run(debug=True, ssl_context='adhoc')  # Use proper SSL in production