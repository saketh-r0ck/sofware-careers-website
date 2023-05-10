import socket
c1 = socket.socket()
c1.connect(('localhost', 9990))
# c.send((bytes('Nishanth'),'utf-8'))
print(c1.recv(11).decode())
c1.close()
