import net from "net";

export const queryCppCache = (command, key, value = "") => {
  return new Promise((resolve, reject) => {
    const client = new net.Socket();
    client.setTimeout(1000);

    client.connect(5000, "127.0.0.1", () => {
      const payload = value ? `${command} ${key} ${value}` : `${command} ${key}`;
      client.write(payload);
    });

    client.on("data", (data) => {
      const response = data.toString().trim();
      client.destroy();
      resolve(response);
    });

    client.on("timeout", () => {
      client.destroy();
      reject(new Error("TCP connection timeout"));
    });

    client.on("error", (err) => {
      client.destroy();
      reject(err);
    });
  });
};
