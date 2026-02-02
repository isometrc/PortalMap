# PortalMap
PortalMap is a simple service to facilitate Avalonian Roads navigation in Albion Online.

It allows users to create "zone" nodes and specify which other zones they are connected to, how long said connections will last and the maximum number of players that can fit through.

![map](https://files.catbox.moe/e6x0va.png "map")

Future updates will add user groups and permissions, pathfinding based on group size and the ability to specify the type of zone and its contents.

### Implementation
GraphDracula was used to implement most of the graph functionality. Front-end and back-end communication was implemented with Node.js, Ajax and embedded javascript.

### To self-host, Node.js and MySQL (or MariaDB) is required.
The database needs a 'zones' table, comprising of the following fields:
* ID (auto-increment int primary key)
* Name (varchar, size 50)
* Conn1Name (varchar, size 50)
* Conn1Time (time)
* Conn1Size (int)
* Conn2Name (varchar, size 50)
* ...
* Conn7Name (varchar, size 50)
* Conn7Time (time)
* Conn7Size (int)

### To start:
* Change database credentials or port to your liking.
```
$ node index.js
```

![edit](https://files.catbox.moe/ewbzk8.png "edit") 
