$(document).ready(function() {
    // Function to show error icon and tooltip for invalid input
    function showErrorIcon(inputField, tooltipText) {
        if (inputField.parent().find('.error-icon').length === 0) {
            inputField.parent().find('.label-icon').remove();
            var errorIcon = $('<span class="input-group-text error-icon" id="basic-addon2">!</span>');
            inputField.after(errorIcon);
            errorIcon.tooltip({
                title: tooltipText,
                placement: 'right'
            });
        }
    }

    // Function to hide error icon and tooltip for valid input
    function hideErrorIcon(inputField) {
        inputField.parent().find('.error-icon').remove();
    }

    // Function to show tooltip for label icons
    function showLabelIconTooltip(labelIcon, tooltipText) {
        labelIcon.tooltip({
            title: tooltipText,
            placement: 'right'
        });
    }

    // Event listener to validate input on keyup
    $('input[type="text"]').on('keyup', function() {
        var inputValue = $(this).val();
        var isValid = !isNaN(inputValue) && inputValue.trim() !== '';
        if (!isValid) {
            showErrorIcon($(this), 'Please enter numbers only');
        } else {
            hideErrorIcon($(this));
        }
    });

    $('#taxCalculatorForm').submit(function(event) {
        event.preventDefault(); // Prevent form submission
        
        var grossIncome = parseFloat($('#annualIncome').val());
        var extraIncome = parseFloat($('#extraIncome').val());
        var deductions = parseFloat($('#deductions').val());
        var ageGroup = $('#ageGroup').val();
    
        if (ageGroup === null || ageGroup === '') {
            showErrorIcon($('#ageGroup'), 'Input field is mandatory');
            return;
        }

        var overallIncome = grossIncome + extraIncome - deductions;
        if (isNaN(overallIncome)) {
            return;
        }
        
        var tax = 0;
        
        if (overallIncome > 800000) {
            switch (ageGroup) {
                case '<40':
                    tax = 0.3 * (overallIncome - 800000);
                    break;
                case '40-60':
                    tax = 0.4 * (overallIncome - 800000);
                    break;
                case '≥60':
                    tax = 0.1 * (overallIncome - 800000);
                    break;
                default:
                    tax = 0;
            }
        }
        
        var finalIncome = overallIncome - tax;
        $('#finalIncome').text(finalIncome.toFixed(2));

        hideErrorIcon($('#ageGroup'));

        $('#resultContainer').css('visibility', 'visible');
        $('.overlay').addClass('show-overlay');
    });

    $('#ageGroup').change(function() {
        var ageGroup = $(this).val();
        if (ageGroup !== null && ageGroup !== '') {
            hideErrorIcon($(this));
        }
    });

    // Event listener for the close button
    $('#closeResult').click(function() {
        $('#resultContainer').css('visibility', 'hidden');
        $('.overlay').removeClass('show-overlay');
    });

    // Show tooltip for label icons
    showLabelIconTooltip($('#grossIncomeLabelIcon'), 'Gross Annual Income is your total salary in a year');
    showLabelIconTooltip($('#extraIncomeLabelIcon'), 'Extra Income is any additional income you receive, such as bonuses or investments');
    showLabelIconTooltip($('#deductionsLabelIcon'), 'Total Applicable Deductions are any eligible deductions that reduce your taxable income');
    showLabelIconTooltip($('#ageGroupLabelIcon'), 'Age Group determines the tax rate based on your age');
});
