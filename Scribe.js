//Scribe- File API library
//CURENTLY IN ALPHA
(function (window, undefined) {
	//define some variables
	var document = window.document,
		Scribe = {
			version: '1.0 Penguin'
		};

	/*** FILEREADER STUFF ***/
	Scribe.fileSelect = function (e) {
		var Scribe = e.target.files;
		for (var i = 0, f; f = Scribe[i]; i++) {
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

	Scribe.drag = function (dropZone, ondrop) {
		dropZone.addEventListener('dragover', handleDrag, false);
		dropZone.addEventListener('drop', ondrop, false);
	};

	Scribe.loadimage = function (e) {
		var f = Scribe.fileSelect(e).obj;
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

	Scribe.readBlob = function (el, start, stop) {
		var Scribe = document.querySelector(el).files;
		if (!Scribe.length) {
			alert('Please select a file!');
			return;
		}

		var file = Scribe[0], reader = new FileReader();
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

	Scribe.readBinary = function (file) {
		var reader = new FileReader();
		return reader.readAsBinaryString(file);
	};

	Scribe.readDataURL = function (file) {
		var reader = new FileReader();
		return reader.readAsDataURL(file);
	};

	Scribe.readText = function (file) {
		var reader = new FileReader();
		return reader.readAsText(file);
	};

	Scribe.readBuffer = function (file) {
		var reader = new FileReader();
		return reader.readAsArrayBuffer(file);
	};

	Scribe.slice = Scribe.readBlob; //alias for readBlob

	Scribe.monitor = function (e, start, progress, abortel) {
		var file = Scribe.fileSelect(e).obj, reader = new FileReader();
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
	Scribe.fs = Scribe.fileSelect;

	window.Scribe = Scribe;

})(window, undefined);