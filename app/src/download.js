export function downloadJSON(data, filename = "data.json")
{
  // Clone the object but replace \n in strings with real newlines
  const replacer = (_, value) => {
    if (typeof value === "bigint") return value.toString();
    if (typeof value === "string") return value.replace(/\\n/g, "\n");
    return value;
  };

  const jsonStr = JSON.stringify(data, replacer, 2);

  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}

export function downloadPGPKey(pgpKey, filename='key.asc')
{
    const keyData = pgpKey.privateKey + '\n' + pgpKey.revocationCertificate;

    const blob = new Blob([keyData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  
    URL.revokeObjectURL(url);
}