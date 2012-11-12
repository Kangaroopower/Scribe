//Latte- File API library
//CURENTLY IN ALPHA
(function (window, undefined) {
	//define some variables
	var document = window.document,
		Latte = {
			version: '1.0 Polar Bear'
		};

	/*** FILEREADER STUFF ***/
	Latte.fileSelect = function (e) {
		var Latte = e.target.Latte;
		for (var i = 0, f; f = Latte[i]; i++) {
			return {
				'name': escape(f.name),
				'type': f.type,
				'size': f.size,
				'lastmodified': f.lastModifiedDate,
				'obj': f

			};
		}
		return false;
	};

	var handleDrag = function (e) {
		e.stopPropagation();
		e.preventDefault();
		e.dataTransfer.dropEffect = 'copy';
	};

	Latte.drag = function (dropZone, ondrop) {
		dropZone.addEventListener('dragover', handleDrag, false);
		dropZone.addEventListener('drop', ondrop, false);
	};

	Latte.loadimage = function (e) {
		var f = Latte.fileSelect(e).obj;
		if (!f.type.match('image.*')) {
			return false;
		}

		var reader = new FileReader();
		reader.readAsDataURL(f);
		reader.onload = (function(theFile) {
			return {
				'file': theFile,
				'name': escape(theFile.name)
			};
		})(f);
	};

	Latte.readBlob = function (el, start, stop) {
		var Latte = document.querySelector(el).Latte;
		if (!Latte.length) {
			alert('Please select a file!');
			return;
		}

		var file = Latte[0], reader = new FileReader();
		start = parseInt(start) || 0;
		stop = parseInt(stop) || file.size - 1;

		reader.onloadend = function(e) {
			if (e.target.readyState === FileReader.DONE) {
				return {
					'content': reader.readAsBinaryString(file.slice(start, stop + 1)),
					'start': start + 1,
					'end': stop + 1,
					'size': file.size
				};
			}
		};
	};

	Latte.readBinary = function (file) {
		var reader = new FileReader();
		return reader.readAsBinaryString(file);
	};

	Latte.readDataURL = function (file) {
		var reader = new FileReader();
		return reader.readAsDataURL(file);
	};

	Latte.readText = function (file) {
		var reader = new FileReader();
		return reader.readAsText(file);
	};

	Latte.readBuffer = function (file) {
		var reader = new FileReader();
		return reader.readAsArrayBuffer(file);
	};

	Latte.slice = Latte.readBlob; //alias for readBlob

	Latte.monitor = function (e, start, progress, abortel) {
		var file = Latte.fileSelect(e).obj, reader = new FileReader();
		reader.onerror = function (evt) {
			switch(evt.target.error.code) {
				case evt.target.error.NOT_FOUND_ERR:
					alert('File Not Found!');
					break;
				case evt.target.error.NOT_READABLE_ERR:
					alert('File is not readable');
					break;
				case evt.target.error.ABORT_ERR:
					break; // noop
				default:
					alert('An error occurred reading this file.');
			}
		};
		reader.onprogress = function(e) {
			eval('progress(e);');
		};
		reader.onabort = function(e) {
			alert('File read cancelled');
		};
		reader.onloadstart = function (e) {
			eval('start(e);');
		};
		reader.onload = function (e) {
			eval('ondone(e);');
		};

		document.getElementById(abortel).onclick = reader.abort();

		// Read in the image file as a binary string.
		reader.readAsBinaryString(file[0]);
	};



	window.Latte = Latte;

})(window, undefined);