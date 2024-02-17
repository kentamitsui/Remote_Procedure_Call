import math,socket,json

def floor(x):
    return int(math.floor(x))

def hello(name):
    return f"Hello {name}"

function_hashmap = {
    "floor": floor,
    "hello": hello,
}

def process_request(request_json):
    method = request_json["method"]
    if method not in function_hashmap:
        return {
            "error": "function is not exist",
            "id": request_json.get("id", 0)
        }
    
    params = request_json["params"]
    param_types = request_json["param_types"]
    request_id = request_json["id"]
    
    params = [params] if not isinstance(params, list) else params
    result = function_hashmap[method](*params)
    
    response = {
        "results: ": result,
        "inputed param: ": params,
        "param_type: ": param_types,
        "id: ": request_id
    }
    return response

def start_server():
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as server_socket:
        server_socket.bind(("localhost", 12345))
        server_socket.listen()
        print("server listening on localhost:12345")
        
        while True:
            connection, client_address = server_socket.accept()
            with connection:
                print(f"connected to {client_address}")
                data = connection.recv(1024)
                # decoding to JSON data requests from client
                request_json = json.loads(data.decode())
                response = process_request(request_json)
                print(response)
                connection.sendall(json.dumps(response).encode())
                connection.close()
            
if __name__ == "__main__":
    start_server()