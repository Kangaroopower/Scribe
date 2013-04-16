//Steamboat- File API library
//CURENTLY IN ALPHA
(function (window, undefined) {
	//define some variables
	var document = window.document,
		Steamboat = {
			version: '1.0 Penguin'
		};

	/*** FILEREADER STUFF ***/
	Steamboat.fileSelect = function (e) {
		var Steamboat = e.target.Steamboat;
		for (var i = 0, f; f = Steamboat[i]; i++) {
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

	Steamboat.drag = function (dropZone, ondrop) {
		dropZone.addEventListener('dragover', handleDrag, false);
		dropZone.addEventListener('drop', ondrop, false);
	};

	Steamboat.loadimage = function (e) {
		var f = Steamboat.fileSelect(e).obj;
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

	Steamboat.readBlob = function (el, start, stop) {
		var Steamboat = document.querySelector(el).Steamboat;
		if (!Steamboat.length) {
			alert('Please select a file!');
			return;
		}

		var file = Steamboat[0], reader = new FileReader();
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

	Steamboat.readBinary = function (file) {
		var reader = new FileReader();
		return reader.readAsBinaryString(file);
	};

	Steamboat.readDataURL = function (file) {
		var reader = new FileReader();
		return reader.readAsDataURL(file);
	};

	Steamboat.readText = function (file) {
		var reader = new FileReader();
		return reader.readAsText(file);
	};

	Steamboat.readBuffer = function (file) {
		var reader = new FileReader();
		return reader.readAsArrayBuffer(file);
	};

	Steamboat.slice = Steamboat.readBlob; //alias for readBlob

	Steamboat.monitor = function (e, start, progress, abortel) {
		var file = Steamboat.fileSelect(e).obj, reader = new FileReader();
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

	//Aliases
	Steamboat.fs = Steamboat.fileSelect;

	window.Steamboat = Steamboat;

})(window, undefined);