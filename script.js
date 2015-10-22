function addValuesInRow(i)
{
	/*document.getElementById('total-'+i).value = 	
		parseInt(document.getElementById('column-a-'+ i).value) + 
		parseInt(document.getElementById('column-b-'+ i).value) +
		parseInt(document.getElementById('column-c-'+ i).value) +
		parseInt(document.getElementById('column-d-'+ i).value); */
		$('#total-'+i).val(
				parseInt($('#column-a-'+ i).val()) + 
				parseInt($('#column-b-'+ i).val()) +
				parseInt($('#column-c-'+ i).val()) + 
				parseInt($('#column-d-'+ i).val()) 
				);

}

var clearAll = function()
{
	
	for(var i = 1;i<11;i++)
	{
		$('#column-a-'+ i).val(1);
		$('#column-b-'+ i).val(1);
		$('#column-c-'+ i).val(1);
		$('#column-d-'+ i).val(1);
		console.log('Clear all Called');
		$('#total-'+i).val(
				parseInt($('#column-a-'+ i).val()) + 
				parseInt($('#column-b-'+ i).val()) +
				parseInt($('#column-c-'+ i).val()) + 
				parseInt($('#column-d-'+ i).val()) 
				);
	}
}

$(document).ready(function(){
	clearAll();
});

$('#nameSelector').change(clearAll());
/*
	$('column-a-'+i).change(addValuesInRow(i));
	$('column-b-'+i).change(addValuesInRow(i));
	$('column-c-'+i).change(addValuesInRow(i));
	$('column-d-'+i).change(addValuesInRow(i));

*/
