import socket
# Creating a socket it accepts two parameters 2nd one is internet protocol
s = socket.socket()
s.bind(('localhost', 9990))  # binding a port for server (ipaddress,portno)
s.listen(3)  # 3 is no of clients it listen to

while True:
    c, addr = s.accept()  # accepting client, returns client socket and its address
    #print(addr)  (ipaddress,portNo)
    c.send(bytes('Hello world', 'utf-8'))
    c.close() 