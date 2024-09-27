$(document).ready(function(){
    let standardCardHeightMM = 53.98;
    let standardScaleWidthMM = 200;
    let standardScaleWidthInch = 203.2;
    //let minRingSizeMM = 14.0;
    //let maxRingSizeMM = 22.6;
    let minRingSizeMM = getMinRingDiameterMM();
    let maxRingSizeMM = getMaxRingDiameterMM();
    let previousPage = null;
    var pixelToMMRatio = $.cookie('pixelToMMRatio');
    let timeout;
    let interval;

    // Initialize App
    showPage('init_calibration_page');
    //---------------

    // Select app type
    $('#init_landing_page .app-link[data-page]').on('click', function() {
        let page = $(this).data('page');
        showPage(page);
    });
    //----------------

    // Select Calibration Type
    $('#init_calibration_page .start-calibration').on('click', function(){
        let calibrationType = $("#init_calibration_page input[name=calibration_type]:checked").val();
        let page;
        if(calibrationType == 'card')
        {
            page = 'card_calibration_page';
        }
        else if(calibrationType == 'scale') {
            page = 'scale_calibration_page';
        }
        showPage(page);
    });
    //------------------------

    // Resize Card
    $('#card_calibration_page #card_resize_range').on('change mousemove touchmove', function(){
        $('#card_calibration_page .card-image-wrapper').css('background-size', 'auto '+$(this).val()+'px');
        $('#card_calibration_page .card-image-wrapper .lines').css('height', (parseFloat($(this).val())+4)+'px');
    });
    $('#card_calibration_page #card_resize_decrease').on('mousedown', function(){
        reduce_card_size();
        timeout = setTimeout(function(){
            interval = setInterval(function(){
                reduce_card_size();
            }, 15);
        }, 500);
    });
    $('#card_calibration_page #card_resize_increase').on('mousedown', function(){
        increase_card_size();
        timeout = setTimeout(function(){
            interval = setInterval(function(){
                increase_card_size();
            }, 15);
        }, 500);
    });
    $('#card_calibration_page #card_resize_decrease, #card_calibration_page #card_resize_increase').on('mouseup mouseout', function(){
        clearTimeout(timeout);
        clearInterval(interval);
    });
    function reduce_card_size() {
        let card_resize_range_value = $('#card_calibration_page #card_resize_range').val()
        $('#card_calibration_page #card_resize_range').val(parseFloat(card_resize_range_value)-parseFloat(0.5)).change();
    }
    function increase_card_size() {
        let card_resize_range_value = $('#card_calibration_page #card_resize_range').val()
        $('#card_calibration_page #card_resize_range').val(parseFloat(card_resize_range_value)+parseFloat(0.5)).change();
    }
    //------------

    // Resize Ruler
    $('#scale_calibration_page #scale_resize_range').on('change mousemove touchmove', function(){
        $('#scale_calibration_page .mm-scale-image-wrapper').css('background-size', $(this).val()+'px auto');
        $('#scale_calibration_page .inch-scale-image-wrapper').css('background-size', $(this).val()+'px auto');
    });
    $('#scale_calibration_page #scale_resize_decrease').on('mousedown', function(){
        reduce_ruler_size();
        timeout = setTimeout(function(){
            interval = setInterval(function(){
                reduce_ruler_size();
            }, 15);
        }, 500);
    });
    $('#scale_calibration_page #scale_resize_increase').on('mousedown', function(){
        increase_ruler_size();
        timeout = setTimeout(function(){
            interval = setInterval(function(){
                increase_ruler_size();
            }, 15);
        }, 500);
    });
    $('#scale_calibration_page #scale_resize_decrease, #scale_calibration_page #scale_resize_increase').on('mouseup mouseout', function(){
        clearTimeout(timeout);
        clearInterval(interval);
    });
    function reduce_ruler_size() {
        let scale_resize_range_value = $('#scale_calibration_page #scale_resize_range').val()
        $('#scale_calibration_page #scale_resize_range').val(parseFloat(scale_resize_range_value)-parseFloat(2)).change();
    }
    function increase_ruler_size() {
        let scale_resize_range_value = $('#scale_calibration_page #scale_resize_range').val()
        $('#scale_calibration_page #scale_resize_range').val(parseFloat(scale_resize_range_value)+parseFloat(2)).change();
    }
    //-------------

    // Toggle Ruler Unit
    $('#scale_calibration_page .unit-tabs .tab').on('click', function() {
        let unit = $(this).data('unit');
        $('#scale_calibration_page .unit-tabs .tab').removeClass('active');
        $('#scale_calibration_page .mm-scale-image-wrapper').hide();
        $('#scale_calibration_page .inch-scale-image-wrapper').hide();
        $(this).addClass('active');
        if(unit == 'mm') {
            $('#scale_calibration_page .mm-scale-image-wrapper').show();
        }
        else {
            $('#scale_calibration_page .inch-scale-image-wrapper').show();
        }
    });
    //------------------

    // Save card pixel to mm ratio
    $('#card_calibration_page .btn-save-calibration').on('click', function(){
        let cardHeightPX = $('#card_calibration_page #card_resize_range').val();
        pixelToMMRatio = cardHeightPX / standardCardHeightMM;
        $.cookie('pixelToMMRatio', pixelToMMRatio, {SameSite: 'Lax', secure: true});
        showPage('ring_size_calculator_page');
    });
    //----------------------------

    // Save scale pixel to mm ratio
    $('#scale_calibration_page .btn-save-calibration').on('click', function(){
        let scaleWidthPX = $('#scale_calibration_page #scale_resize_range').val();
        let unit = $('#scale_calibration_page .unit-tabs .tab.active').data('unit');
        if(unit == 'mm') {
            pixelToMMRatio = scaleWidthPX / standardScaleWidthMM;
        }
        else {
            pixelToMMRatio = scaleWidthPX / standardScaleWidthInch;
        }

        console.log(pixelToMMRatio);
        $.cookie('pixelToMMRatio', pixelToMMRatio, {SameSite: 'Lax', secure: true});
        showPage('ring_size_calculator_page');
    });
    //----------------------------

    // Resize ring canvas
    $('#ring_size_calculator_page #ring_resize_range').on('change mousemove touchmove', function(){
        let ringSizePX = $(this).val();
        //pixelToMMRatio = $.cookie('pixelToMMRatio');
        let ringSizeMM = ringSizePX / pixelToMMRatio;

        $('#ring_size_calculator_page .ring-sizer').css({'height': ringSizePX+'px', 'width': ringSizePX+'px'});
        $('#ring_size_calculator_page .for-line').css({'width': ringSizePX+'px'});
        showRingSize(ringSizeMM);
    })
    $('#ring_size_calculator_page #ring_resize_decrease').on('mousedown', function(){
        reduce_ring_size();
        timeout = setTimeout(function(){
            interval = setInterval(function(){
                reduce_ring_size();
            }, 100);
        }, 500);
    });
    $('#ring_size_calculator_page #ring_resize_increase').on('mousedown', function(){
        increase_ring_size();
        timeout = setTimeout(function(){
            interval = setInterval(function(){
                increase_ring_size();
            }, 100);
        }, 500);
    });
    $('#ring_size_calculator_page #ring_resize_decrease, #ring_size_calculator_page #ring_resize_increase').on('mouseup mouseout', function(){
        clearTimeout(timeout);
        clearInterval(interval);
    });
    function reduce_ring_size() {
        let ring_resize_range_value = $('#ring_size_calculator_page #ring_resize_range').val();
        let step = $('#ring_size_calculator_page #ring_resize_range').attr('step');
        $('#ring_size_calculator_page #ring_resize_range').val(parseFloat(ring_resize_range_value)-parseFloat(step)).change();
    }
    function increase_ring_size() {
        let ring_resize_range_value = $('#ring_size_calculator_page #ring_resize_range').val();
        let step = $('#ring_size_calculator_page #ring_resize_range').attr('step');
        $('#ring_size_calculator_page #ring_resize_range').val(parseFloat(ring_resize_range_value)+parseFloat(step)).change();
    }
    //-------------------

    // Go to page
    $('button.btn-go-to').on('click', function() {
        let page = $(this).data('page');
        showPage(page);
    });
    //-----------

    // Go to back page
    $('button.btn-go-to-back').on('click', function() {
        showPage((previousPage?previousPage:'init_landing_page'));
    });
    //----------------

    // Recalibrate
    $('#ring_size_calculator_page .btn-recalibrate').on('click', function(){
        $.removeCookie('pixelToMMRatio');
        showPage('init_calibration_page');
        return(false);
    });
    //------------

    // Change Country
    $('.btn-change-country').on('click', function(){
        showPage('country_change_page');
        return(false);
    });
    //---------------

    // Select Country
    $('#country_change_page .country-list-item').on('click', function(){
        let countryName = $(this).text();
        let countryFlag = $(this).data('image');
        countryCode = $(this).data('code');
        $('.btn-change-country .country-name').text(countryName);
        $('#ring_size_calculator_page .ring-measurement-wrapper .ring-size-caption .country-flag').attr('src', flagsURL+countryFlag);
        if(countryCode == 'US') {
            $('#ring_size_calculator_page .ring-measurement-wrapper .ring-size-caption').hide();
        }
        else {
            $('#ring_size_calculator_page .ring-measurement-wrapper .ring-size-caption').show();
        }
        $('#ring_size_calculator_page #ring_resize_range').change();
        showPage((previousPage?previousPage:'init_landing_page'));
    });
    //---------------

    // Show Page
    function showPage(pageName) {
        //let pixelToMMRatio = undefined;

        if(pageName == 'country_change_page') {
            previousPage = $('section.page:visible').attr('id');
        }

        /*if(pageName == 'card_calibration_page') {
            setTimeout(function(){
                $('#'+pageName+' .video-guide').fadeIn();
            }, 1000);
        }*/

        if(pageName == 'ring_size_calculator_page') {
            //pixelToMMRatio = $.cookie('pixelToMMRatio');
            if(pixelToMMRatio == undefined) {
                pageName = 'init_calibration_page';
            }
        }

        if($(".page:visible").length > 0) {
            $(".page:visible").fadeOut(function(){
                $(".page#"+pageName).fadeIn(show_video_guide(pageName));
            });
        }
        else {
            $(".page#"+pageName).fadeIn(show_video_guide(pageName));
        }
        if(pageName == 'ring_size_calculator_page') {
            minRingSizeMM = getMinRingDiameterMM();
            maxRingSizeMM = getMaxRingDiameterMM();
            $('#ring_size_calculator_page #ring_resize_range').attr('min', (minRingSizeMM*pixelToMMRatio).toFixed(1)).attr('max', Math.ceil((maxRingSizeMM*pixelToMMRatio))+1).val(((minRingSizeMM*pixelToMMRatio)+(maxRingSizeMM*pixelToMMRatio))/2).change();
        }
    }
    //----------

    // Show Page Video Guide
    function show_video_guide(pageName) {
        if($('#'+pageName+' .video-guide').length > 0) {
            setTimeout(function(){
                $('#'+pageName+' .video-guide').fadeIn();
                $('#'+pageName+' .video-guide video').get(0).currentTime = 0;
                $('#'+pageName+' .video-guide video').get(0).play();
            }, 1000);
        }
    }
    //-----------------------

    // Show Video Guide
    $('.btn-show-video-guide').on('click', function() {
        if($(this).closest('.page').find('.video-guide').length > 0) {
            $(this).closest('.page').find('.video-guide video').get(0).currentTime = 0;
            $(this).closest('.page').find('.video-guide video').get(0).play();
            $(this).closest('.page').find('.video-guide').fadeIn();
        }
    });
    //------------------

    // Close Video Guide
    $('.video-guide').on('click', '.btn-gotit', function() {
        $(this).closest('.video-guide').find('video').get(0).pause();
        $(this).closest('.video-guide').fadeOut();
    });
    //------------------

    // Show Modal
    function showModel(modalName) {
        $(".modal#"+modalName).show();
    }
    //-----------

    function showRingSize(ringSizeMM) {
        let USRingSize = getMinRingSize('US');
        let ringSize = getMinRingSize(countryCode);
        ringSizeMM = ringSizeMM.toFixed(1);
        for(let m=0;m<ringSizeMapping.length;m++) {
            if(ringSizeMapping[m].country == 'US') {
                if(ringSizeMM >= ringSizeMapping[m].diameterMM) {
                    USRingSize = ringSizeMapping[m].ringSize
                }
            }
        }
        for(let m=0;m<ringSizeMapping.length;m++) {
            if(ringSizeMapping[m].country == countryCode) {
                if(ringSizeMM >= ringSizeMapping[m].diameterMM) {
                    ringSize = ringSizeMapping[m].ringSize
                }
            }
        }
        $('#ring_size_calculator_page .us-ring-size-caption .country-caption').text('US');
        $('#ring_size_calculator_page .us-ring-size-caption .us-ring-size').text(USRingSize);

        $('#ring_size_calculator_page .ring-size-caption .country-caption').text(countryCode);
        $('#ring_size_calculator_page .ring-size-caption .ring-size').text(ringSize);
    }

    function getMinRingSize(countryCode) {
        for(let m=0;m<ringSizeMapping.length;m++) {
            if(ringSizeMapping[m].country == countryCode) {
                return(ringSizeMapping[m].ringSize);
            }
        }
    }

    function getMinRingDiameterMM() {
        for(let m=0;m<ringSizeMapping.length;m++) {
            if(ringSizeMapping[m].country == countryCode) {
                return(ringSizeMapping[m].diameterMM);
            }
        }
    }

    function getMaxRingDiameterMM() {
        let maxRingDiameterMM = 0;
        for(let m=0;m<ringSizeMapping.length;m++) {
            if(ringSizeMapping[m].country == countryCode) {
                maxRingDiameterMM = ringSizeMapping[m].diameterMM;
            }
        }
        return(maxRingDiameterMM);
    }

    $('#ring_size_calculator_page #ring_resize_range').change();
});
