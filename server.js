const http = require("http");
const fs = require("fs").promises;

const host = 'localhost';
const port = 8000;

const requestListener = function (req, res) {
    const file_name = (req.url == "/") ? "/index.html" : req.url;
    fs.readFile(__dirname + "/src" + file_name).then(
        contents => {
            a = file_name.split('.');
            switch (a[a.length - 1]) {
                case "html":
                    console.log("HTML File : " + file_name);
                    res.setHeader("Content-Type", "text/html; charset=utf-8");
                    break;
                case "json":
                    console.log("JSON File : " + file_name);
                    res.setHeader("Content-Type", "text/json");
                    break;
                case "css":
                    console.log("CSS File : " + file_name);
                    res.setHeader("Content-Type", "text/css");
                    break;
                case "csv":
                    console.log("CSV File : " + file_name);
                    res.setHeader("Content-Type", "text/csv");
                    break;
                case "js":
                    console.log("Javascript File : " + file_name);
                    res.setHeader("Content-Type", "text/javascript");
                    break;
                case "ico":
                    console.log("ICO File : " + file_name);
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
