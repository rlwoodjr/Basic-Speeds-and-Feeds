
$(document).ready(function(){


    if (localStorage.getItem('Machine')) {
        $('#selectMachine').val(localStorage.getItem('Machine'));
    }  else{
        $('#selectMachine').val("Quantum")
    }
    if (localStorage.getItem('Material')) {
        $('#selectMaterial').val(localStorage.getItem('Material'));
    }  else{
        $('#selectMaterial').val("Hardwood")
    }
    if (localStorage.getItem('Spindle')) {
        $('#selectSpindle').val(localStorage.getItem('Spindle'));
    }  else{
        $('#selectMaterial').val("Makita")
    }
    if (localStorage.getItem('BitType')) {
        $('#selectBitType').val(localStorage.getItem('BitType'));
    }  else{
        $('#selectBitType').val("End mill")
    }
    if (localStorage.getItem('BitDiameterIn')) {
        $('#selectBitDiameterinch').val(localStorage.getItem('BitDiameterIn'));
    }  else{
        $('#selectBitDiameterinch').val("0.125")
    }
    if (localStorage.getItem('BitDiameterMm')) {
        $('#selectBitDiametermm').val(localStorage.getItem('BitDiameterMm'));
    }  else{
        $('#selectBitDiametermm').val("3.0")
    }
    if (localStorage.getItem('Flutes')) {
        $('#selectFlutes').val(localStorage.getItem('Flutes'));
    }  else{
        $('#selectFlutes').val("2")
    }
    

    if (localStorage.getItem('Units')) {
        $('#selectUnits').val(localStorage.getItem('Units'));
    }  else{
        $('#selectUnits').val("inches")
    }



    changeUnits()
    updateValues()

})


function changeUnits(){

    if(  $('#selectUnits').val()=="inches"){

        $('#bitin').show();
        $('#bitmm').hide();

    }else{
        $('#bitin').hide();
        $('#bitmm').show();
    }

}

function storeValues(){

    localStorage.setItem('Machine', $('#selectMachine').val());
    localStorage.setItem('Material', $('#selectMaterial').val());
    localStorage.setItem('Spindle', $('#selectSpindle').val());
    localStorage.setItem('BitType', $('#selectBitType').val());
    localStorage.setItem('BitDiameterIn', $('#selectBitDiameterinch').val());
    localStorage.setItem('BitDiameterMm', $('#selectBitDiametermm').val());
    localStorage.setItem('Flutes', $('#selectFlutes').val());
    localStorage.setItem('Units', $('#selectUnits').val());

}



function updateValues(){

    storeValues()


    var UnitConvert = 1;
    var SFM=0;
    var MaterialFactor = 1;
    var SurfaceSpeed = 0;
    var ChipLoad = 0;
    var RPM = 0;
    var DOC =0;
    var SFMConvert = 304.8;
    var FluteCount =1;
    var Dial = 6;
    const addNote = [false,false,false,false,false,false,false,false,false,false,false];

    if( $('#selectBitType').val()=="V-Bit" ){
        $('#selectBitDiametermm').hide()
        $('#selectBitDiameterinch').hide()
        if(  $('#selectUnits').val()=="inches"){
            BitDiameter=0.04
        }else{
            BitDiameter=1.0
        }

    }else{
        $('#selectBitDiametermm').show()
        $('#selectBitDiameterinch').show()
    }


    // Get bit diameter mm or inches
    if(  $('#selectUnits').val()=="inches"){
        BitDiameter =  parseFloat($('#selectBitDiameterinch').val());
        UnitConvert = 1;
        $('#unitText1').html("inches")
        $('#unitText2').html("inches")
        $('#unitText3').html("inches")
        if(BitDiameter <0.1){addNote[4] = true}
        if(BitDiameter >.40){addNote[5] = true}
    }else{
        BitDiameter =  parseFloat($('#selectBitDiametermm').val());
        UnitConvert = 25.4;
        $('#unitText1').html("mm")
        $('#unitText2').html("mm")
        $('#unitText3').html("mm")
        if(BitDiameter < 2.9){addNote[4] = true}
        if(BitDiameter > 10){addNote[5] = true}
5
    }





    // assign values for calculating ( Select material for the SFM and add note)
    switch ($('#selectMaterial').val())  
    {
        case "Aluminum":
            SFM = 350;
            MaterialFactor = 5;
            addNote[2] = true
            break;
        case "Acrylic":
            SFM = 500;
            MaterialFactor = 1.05;
            break;
        case "Acetal":
            SFM = 450;
            MaterialFactor = 0.95;
            break;
        case "Foam board":
            SFM = 1500;
            MaterialFactor = 0.5;
            break;
        case "Hardwood":
            SFM = 600;
            MaterialFactor = 1.1;
            break;
        case "Plywood":
            SFM = 400;
            MaterialFactor = 1;
            break;
        case "MDF":
            SFM = 1000;
            MaterialFactor = 1;
            break;
        case "Softwood":
            SFM = 950;
            MaterialFactor =  .9;
            break;
    }

    var x = BitDiameter / UnitConvert;  //Polynomial equation is FrameStyle inches only. 
    switch ($('#selectMachine').val())
    {

        case "E Series":
            ChipLoad = (0.003 * BitDiameter / UnitConvert + SFM / 10000000) * UnitConvert;
            DOC= 0.0119 * Math.pow(x, -0.564) * UnitConvert / MaterialFactor;
            addNote[3] = true
            $('#selectSpindle').hide()
            break;
        case "Evolution":
            ChipLoad = (0.025 * BitDiameter / UnitConvert + SFM / 5000000) * UnitConvert;
            DOC = (-0.1414 * Math.pow(x, 6) + 1.0412 * Math.pow(x, 5)
                                            - 3.0450 * Math.pow(x, 4) + 4.444 * Math.pow(x, 3)
                                            - 3.2646 * Math.pow(x, 2) + 0.9803 * x + 0.0005) * UnitConvert / MaterialFactor;
            $('#selectSpindle').show()
            break;
        case "Quantum":
            ChipLoad = (0.025 * BitDiameter / UnitConvert + SFM / 5000000) * UnitConvert;
            DOC = (-0.1414 * Math.pow(x, 6) + 1.0412 * Math.pow(x, 5)
                                            - 3.0450 * Math.pow(x, 4) + 4.444 * Math.pow(x, 3)
                                            - 3.2646 * Math.pow(x, 2) + 0.9803 * x + 0.0005) * UnitConvert / MaterialFactor;
            $('#selectSpindle').show()
            break;
        case "KL7 Series":
            ChipLoad =(0.035 * BitDiameter / UnitConvert + SFM / 1000000) * UnitConvert;
            DOC =(0.1606 * Math.pow(x, 5) - 0.9537 * Math.pow(x, 4)
                                              + 2.0856 * Math.pow(x, 3) - 2.0053 * Math.pow(x, 2)
                                              + 0.7268 * x + 0.015) * UnitConvert / MaterialFactor;
            $('#selectSpindle').show()
            break;
        case "Revolution":
            ChipLoad = (0.025 * BitDiameter / UnitConvert + SFM / 5000000) * UnitConvert;
            DOC = (-0.1414 * Math.pow(x, 6) + 1.0412 * Math.pow(x, 5)
                                            - 3.0450 * Math.pow(x, 4) + 4.444 * Math.pow(x, 3)
                                            - 3.2646 * Math.pow(x, 2) + 0.9803 * x + 0.0005) * UnitConvert / MaterialFactor;
            $('#selectSpindle').show()
            break;
        case "Other":
            ChipLoad = (0.025 * BitDiameter / UnitConvert + SFM / 5000000) * UnitConvert;
            DOC = (-0.1414 * Math.pow(x, 6) + 1.0412 * Math.pow(x, 5)
                                            - 3.0450 * Math.pow(x, 4) + 4.444 * Math.pow(x, 3)
                                            - 3.2646 * Math.pow(x, 2) + 0.9803 * x + 0.0005) * UnitConvert / MaterialFactor;
            $('#selectSpindle').show()
            break;
    }


    

    if($('#selectMachine').val() == "E Series"){

        // Calculate RPM
        RPM = 30000
        SurfaceSpeed = SFM * SFMConvert;
        FluteCount =  parseFloat($('#selectFlutes').val());
        if(FluteCount>2){addNote[6]=true}
        FeedRate = RPM * FluteCount * ChipLoad*UnitConvert;
        PlungeRate=10;

        $('#projectDial').html("NA");

    }else{  

        RPM = SFM / (0.261799 * BitDiameter) * UnitConvert;
        switch ($('#selectSpindle').val())  
        {
            case "Makita":
                if (RPM > 30000)
                {
                    Dial = 6;
                    Ratio = RPM / 30000;
                    RPM = 30000;
                    addNote[8] = true
                }
                else if (RPM < 10000)
                {
                    Dial = 1;
                    Ratio = RPM / 10000;
                    RPM = 10000;
                    addNote[9] = true
                    DOC=DOC*.6
                }
                else
                {
                    Dial = RPM * 0.00025 - 1.5;
                    Ratio = "1.0";

                }
                break;
            case "DeWalt":
                if (RPM > 27000)
                {
                    Dial = 6;
                    Ratio = (RPM / 27000);
                    RPM =27000;
                    addNote[8] = true
                }
                else if (RPM < 17000)
                {
                    Dial = 1;
                    Ratio = RPM / 17000;
                    RPM =17000;
                    addNote[9] = true
                    DOC=DOC*.7
                }
                else
                {
                    Dial = RPM * 0.0005 - 7.5;
                    Ratio = "1.0";

                }
                break;
            case "Other":

                break;
            }

        // Calculate RPM
        SurfaceSpeed = SFM * SFMConvert;
        FluteCount =  parseFloat($('#selectFlutes').val());
        if(FluteCount>2){addNote[6]=true}
        FeedRate = RPM * FluteCount * ChipLoad*UnitConvert*Ratio;
        PlungeRate=0.5*FeedRate;
        $('#projectDial').html(Dial.toFixed(1));
    }


    $('#projectRPM').html(RPM.toFixed(0));
    $('#projectFR').html(FeedRate.toFixed(0));
    $('#projectPR').html(PlungeRate.toFixed(0));
    $('#projectSO').html(30);
    $('#projectDOC').html(DOC.toFixed(3));

    updateNotes(addNote)
}

    


function updateNotes(addNote){

    var note1="<h4><strong>Calculating Speeds and Feeds</strong></h4><p>It is important to note that there are many variables " +
                "when setting CNC cutting parameters. The values set should be thought of a starting values. With experience, these "+
                "values can be modified to find the sweet spot for the project that you are working on.</p><p><strong>Calculation " +
                "details:</strong></p><p>Surface Feet per Minute (SFM) Is a number that sets the best RPM for cutting the material. " +
                "This number varies depending on the manufacture of the tool and CNC machine. The calculation is:</p><p><strong>SFM = " +
                "RPM x 0.2618 x bit diameter (inches)</strong></p><p>We have added default SFM values. If SFM value is modified, it " +
                "will change the RPM of the spindle. Once the RPM is determined, you can calculate the feed rate with the " +
                "formula:</p><p><strong>Feed Rate = RPM x Flute count x Chip load</strong></p><p>The flute count is the number of flutes " +
                "on the bit, and the chip load is the size of the chip being removed. If the chip load value is modified, it will change " +
                "the feed rate.</p><p>The plunge rate determines the feed rate of the Z axis as the bit plunges into the material. A good " +
                "rule of thumb is to set the plunge rate to 1/2 the feed rate.</p><p><strong>Plunge Rate = 0.5 x Feed Rate</strong></p><p>The " +
                "step over is the space between the passes. The default step over value is set to 0.3 x bit diameter. Stepover should be " +
                "between 0.1 and 0.3 of the bit diameter.</p><p><strong>Stepover = 0.3 x Bit Diameter</strong></p><p>Depth per pass is " +
                "determined by the CNC and the bit diameter. Larger heavy-duty CNC's can cut deeper per pass while smaller and lighter duty " +
                "CNCs will cut at less depth per pass.</p>"


    var note2="<h4><strong>Cutting Aluminum</strong></h4><p>There is a learning curve for cutting aluminum. The sweet spot for the cutting parameters is small and any deviation will "+
                "reduce cutting quality and may damage the bit or workpiece. &nbsp;</p><p>We would recommend&rdquo;</p><p>-&nbsp; 30 psi of air "+
                "flow through a nozzle as a minimum. &nbsp;Mist cooling would be a better alternative. The bit needs to be kept cool and the "+
                "chips need to be removed from the cutting area quickly.</p><p>&nbsp;-&nbsp; O-flute or single flute bit designed to cut aluminum. "+
                "The high helix angle helps remove chips and the low flute count helps keep the feed rate manageable for higher RPMs.</p><p>-&nbsp; "+
                "The bit should be no larger than 1/8\" (3mm) cutting diameter.</p><p>-&nbsp; The workpiece must to be securely clamped to hold it "+
                "in place and reduce any vibrations (If the part vibrates the cutting performance will be reduced and bit damage can "+
                "occur.</p><p>There is an small range of optimal cut depths. &nbsp;Cutting too deep will cause deflection or bit breakage and "+
                "cutting too light will cause rubbing and heat buildup which will dull a bit.</p><p>If the feed rate is too slow, the aluminum "+
                "can melt and built up on the bit, if the feed rate is too fast the bit may break.</p>"

    var note3 = "<h4><strong>E - Series</strong></h4><p>The E Series has a fixed RPM. The feed rate and plunge rate have been adjusted for this RPM.</p>"

    var note4 = "<h4><strong>Small Bits</strong></h4><p>Small bits can break easily. Reduce feed rate and depth of cut for longer bits with small diameters</p>"

    var note5 = "<h4><strong>Large Bits</strong></h4><p>Large bits that are incorrectly set up can cause damage to the CNC and work piece. Reduce feed rate, stepover, and depth per pass.</p>"

    var note6 = "<h4><strong>Flute Count</strong></h4><p>CNC routers spin at a high RPM.  One or two flutes are recommended for most materials.  An O-flute or single flute bit is recommended for cutting aluminum. </p>"

    var note7 = "<p>Chip loads above 0.040\" (1mm) are not recommended.</p>"

    var note8 = "<h4><strong>High RPM</strong></h4><p>The spindle is not capable of spinning at this high of RPM.  The feed and plunge rate have been determined using the highest RPM for the "+
                "selected spindle.  A larger diameter bit or a bit with more flutes until the optimal RPM can be set is recommended.</p>"

    var note9 = "<h4><strong>Low RPM</strong></h4><p>The spindle is not capable of spinning at this low of RPM.  The feed and plunge rate have been determined using the lowest RPM for the selected "+
                "spindle.  A smaller diameter bit or a bit with less flutes until the optimal RPM can be set is recommended.</p>"

    var note10 = "<p></p>"


    text=[note1,note2,note3,note4,note5,note6,note7,note8,note9]

    var displayNote = ""
    for (let i = 1; i < 10; i++) {

        if(addNote[i]){
            displayNote += text[i-1]  + "<br>"
        }
    }

    if(displayNote ==''){
        displayNote = note1
    }


    const element = document.getElementById("selectedNotes");
    element.scrollLeft = 0;
    element.scrollTop = 0;

    $('#selectedNotes').html(displayNote)
}