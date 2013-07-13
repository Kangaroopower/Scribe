//Scribe- File API library
//CURENTLY IN ALPHA and buggy
(function (window, undefined) {
	//define some variables
	var document = window.document,
		Scribe = {
			version: '0.2 Penguin'
		};

	/*** FILEREADER STUFF ***/

	//handles file selection
	Scribe.fileSelect = function (e) {
		var Scribe = e.target.files;
		for (var i = 0, f; f = Scribe[i]; i++) {
			return {
				'name': escape(f.name),
				'type': f.type,
				'size': f.size,
				'lastmodified': f.lastModifiedDate,
				'contents': f

			};
		}
		return false;
	};

	//handles file drag and drop
	var handleDrag = function (e) {
		e.stopPropagation();
		e.preventDefault();
		e.dataTransfer.dropEffect = 'copy';
	};

	Scribe.drag = function (dropZone, ondrop) {
		dropZone.addEventListener('dragover', handleDrag, false);
		dropZone.addEventListener('drop', ondrop, false);
	};

	//Loads a file as a data url
	Scribe.readDataURL = function (e) {
		var f = Scribe.fileSelect(e).contents;
		if (!f.type.match('image.*')) {
			return false;
		}

		var reader = new FileReader();
		reader.readAsDataURL(f);
		reader.onload = (function(theFile) {
			return {
				'file': e.target.result,
				'name': escape(theFile.name)
			};
		})(f);
	};

	//Loads an file as a binary string
	Scribe.readBinary = function (start, stop) {
		this.start = start;
		this.stop = stop;

		this.act = function (e) {
			var fs = Scribe.fileSelect(e), file = fs.contents, reader = new FileReader();
			this.start = parseInt(this.start) || 0;
			this.stop = parseInt(this.stop) || fs.size - 1;

			reader.onloadend = function(e) {
				if (e.target.readyState === FileReader.DONE) {
					return {
						'content': e.target.result,
						'start': this.start + 1,
						'end': this.stop + 1,
						'size': fs.size
					};
				}
			};
			reader.readAsBinaryString(file.slice(start, stop + 1));
		};
	};

	// Read text and readbuffer currently don't work
	Scribe.readText = function (file, encoding) {
		var reader = new FileReader();
		return reader.readAsText(file, encoding);
	};

	Scribe.readBuffer = function (file) {
		var reader = new FileReader();
		return reader.readAsArrayBuffer(file);
	};

	//Monitors a file upload
	Scribe.monitor = function (start, progress, ondone, abortel) {
		this.start = start;
		this.progress = progress;
		this.ondone = ondone;
		this.abortel = abortel;

		this.act = function (e) {
			var file = Scribe.fileSelect(e).contents, reader = new FileReader();
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
				eval('this.progress(e);');
			};
			reader.onabort = function(e) {
				alert('File read cancelled');
			};
			reader.onloadstart = function (e) {
				eval('this.start(e);');
			};
			reader.onload = function (e) {
				eval('this.ondone(e);');
			};

			document.getElementById(this.abortel).onclick = reader.abort();

			// Read in the image file as a binary string.
			reader.readAsBinaryString(file[0]);
		};
	};

	//Aliases
	Scribe.fs = Scribe.fileSelect;

	window.Scribe = Scribe;

})(window, undefined);