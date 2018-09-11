window.ethParser = require('eth-url-parser');

let paramFields = [];

window.addNewParam = function() {
	const ts = Date.now();

	const newKeyField = document.createElement("input");
	newKeyField.type = "text";
	newKeyField.name = `key_${ts}`;
	newKeyField.id = newKeyField.name;
	newKeyField.placeholder = "Key";
	newKeyField.classList.add("field");
	newKeyField.classList.add("short-field");

	const newValField = document.createElement("input");
	newValField.type = "text";
	newValField.name = `val_${ts}`;
	newValField.id = newValField.name;
	newValField.placeholder = "Value";
	newValField.class = "field short-field";
	newValField.classList.add("field");
	newValField.classList.add("short-field");

	const row = document.createElement("p");
	row.classList.add("param-row");
	row.appendChild(newKeyField);
	row.appendChild(newValField);

	paramFields.push(ts);

	document.getElementById("params-container").appendChild(row);
}

window.generate = function() {
	const url_scheme = "ethereum";
	const pay_prefix = document.getElementById("is_payment").checked
		? "pay"
		: null;
	const target_address = document.getElementById("target_address").value;
	const chain_id =
		document.getElementById("chain_id").value !== ""
			? document.getElementById("chain_id").value
			: null;
	const function_name =
		document.getElementById("function_name").value !== ""
			? document.getElementById("function_name").value
			: null;
	let params = {};
	paramFields.forEach(ts => {
		const key = document.getElementById(`key_${ts}`).value;
		let val = document.getElementById(`val_${ts}`).value;
		if (key === "value" && !function_name) {
			if (val !== "") {
				val += "e18";
			}
		}
		if (val !== "") {
			params[key] = val;
		}
	});
    
	try {
         const data = {
			scheme: url_scheme,
			prefix: pay_prefix,
			target_address,
			chain_id,
			function_name,
			parameters: params
		};
        
        console.log(data);
		const url = ethParser.build(data);

        document.getElementById("url").href = url;
        document.getElementById("url").innerText = url;

        const baseImgUrl = 'http://api.qrserver.com/v1/create-qr-code/?color=000000&bgcolor=FFFFFF&data=${DATA}&qzone=1&margin=0&size=250x250&ecc=L';
        const qrCodeUrl = baseImgUrl.replace('${DATA}', escape(url));

        if(document.getElementById("qr-wrapper").firstElementChild){
            const img = document.getElementById("qr-wrapper").firstElementChild;
            img.src = qrCodeUrl;
        }else{
             const img = document.createElement("img");
            img.src = qrCodeUrl
            document.getElementById("qr-wrapper").appendChild(img);
        }

       


	} catch (e) {
		alert(e.toString());
	}

	
}

window.showView = function(name) {
	if (name === "ether") {
		document.getElementById("function_name").style.display = "none";
		document.getElementById("add_parameter").style.visibility = "hidden";
		addNewParam();
		document.getElementById(`key_${paramFields[0]}`).value = "value";
		document.getElementById(`key_${paramFields[0]}`).style.display = "none";
		document.getElementById(`val_${paramFields[0]}`).placeholder =
			"Amount in ETH";
		document.getElementById(`val_${paramFields[0]}`).type = "number";
	} else if (name === "erc20") {
		document.getElementById("payment-link").style.display = "hidden";
		document.getElementById("function_name").style.display = "block";
		document.getElementById("function_name").value = "transfer";
		document.getElementById("function_name").style.display = "none";
		document.getElementById("add_parameter").style.visibility = "hidden";
		addNewParam();
		document.getElementById(`target_address`).placeholder =
			"Contract address";
		document.getElementById(`key_${paramFields[0]}`).value = "address";
		document.getElementById(`key_${paramFields[0]}`).style.display = "none";
		document.getElementById(`val_${paramFields[0]}`).placeholder =
			"Receiver address";
		setTimeout(_ => {
			addNewParam();
			document.getElementById(`key_${paramFields[1]}`).value = "uint256";
			document.getElementById(`key_${paramFields[1]}`).style.display =
				"none";
			document.getElementById(`val_${paramFields[1]}`).type = "number";
			document.getElementById(`val_${paramFields[1]}`).placeholder =
				"Amount of tokens";
		}, 1);
	}
	document.getElementById("form").style.display = "block";
	document.getElementById("buttons").style.display = "none";
	document.getElementById("reset").style.display = "block";
}

// This is just a placeholder for proper validation
window.isValidAddress = function(address) {
	return address.length === 42 && address.toLowerCase().substr(0, 2) === "0x";
}
