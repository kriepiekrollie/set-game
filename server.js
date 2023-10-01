const http = require("http");
const fs = require("fs").promises;

const host = 'localhost';
const port = 8000;

const requestListener = function (req, res) {
    file_name = req.url;
    if (file_name == "/") {
        file_name = "/index.html";
    }

    fs.readFile(__dirname + "/src" + file_name).then(
        contents => {
            a = file_name.split('.');
            switch (a[a.length - 1]) {
                case "html":
                    res.setHeader("Content-Type", "text/html; charset=utf-8");
                    break;
                case "json":
                    res.setHeader("Content-Type", "text/json");
                    break;
                case "css":
                    res.setHeader("Content-Type", "text/css");
                    break;
                case "csv":
                    res.setHeader("Content-Type", "text/csv");
                    break;
                case "js":
                    res.setHeader("Content-Type", "text/javascript");
                    break;
                case "ico":
                    res.setHeader("Content-Type", "image/x-icon");
                    break;
                default:
                    res.setHeader("Content-Type", "text/html; charset=utf-8");
            }
            res.writeHead(200);
            res.end(contents);
        }
    ).catch(
        err => {
            console.log(err)
            res.writeHead(500);
            res.end("An error occurred :(");
            return;
        }
    );
}

const server = http.createServer(requestListener);

server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`); 
});
