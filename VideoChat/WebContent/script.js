/* eslint-disable require-jsdoc */
  $(function() {

	  // set up audio and video input selectors
	  const audioSelect = $('#audioSource');
	  const videoSelect = $('#videoSource');
	  const selectors = [audioSelect, videoSelect];

	  navigator.mediaDevices.enumerateDevices()
	    .then(deviceInfos => {
	      const values = selectors.map(select => select.val() || '');
	      selectors.forEach(select => {
	        const children = select.children(':first');
	        while (children.length) {
	          select.remove(children);
	        }
	      });
	      
	      for (let i = 0; i !== deviceInfos.length; ++i) {
	        const deviceInfo = deviceInfos[i];
	        const option = $('<option>').val(deviceInfo.deviceId);

	        if (deviceInfo.kind === 'audioinput') {
	          option.text(deviceInfo.label ||
	            'Microphone ' + (audioSelect.children().length + 1));
	          audioSelect.append(option);
	        } else if (deviceInfo.kind === 'videoinput') {
	          option.text(deviceInfo.label ||
	            'Camera ' + (videoSelect.children().length + 1));
	          videoSelect.append(option);
	        }
	      }
	      selectors.forEach((select, selectorIndex) => {
	        if (Array.prototype.slice.call(select.children()).some(n => {
	          return n.value === values[selectorIndex];
	        })) {
	          select.val(values[selectorIndex]);
	        }
	      });

	      videoSelect.on('change', step1);
	      audioSelect.on('change', step1);
	    });

	  function step1() {
	    // Get audio/video stream
	    const audioSource = $('#audioSource').val();
	    const videoSource = $('#videoSource').val();
	    const constraints = {
	      audio: {deviceId: audioSource ? {exact: audioSource} : undefined},
	      video: {deviceId: videoSource ? {exact: videoSource} : undefined},
	    };

	    navigator.mediaDevices.getUserMedia(constraints).then(stream => {
	      $('#my-video').get(0).srcObject = stream;
	      localStream = stream;

	      if (existingCall) {
	        existingCall.replaceStream(stream);
	        return;
	      }

	      step2();
	    }).catch(err => {
	      $('#step1-error').show();
	      console.error(err);
	    });
	  }

	  function step2() {
	    $('#step1, #step3').hide();
	    $('#step2').show();
	    $('#callto-id').focus();
	  }

	  function step3(call) {
	    // Hang up on an existing call if present
	    if (existingCall) {
	      existingCall.close();
	    }
	    // Wait for stream on the call, then set peer video display
	    call.on('stream', stream => {
	      const el = $('#their-video').get(0);
	      el.srcObject = stream;
	      el.play();
	    });

	    // UI stuff
	    existingCall = call;
	    $('#their-id').text(call.remoteId);
	    call.on('close', step2);
	    $('#step1, #step2').hide();
	    $('#step3').show();
	  }
	});