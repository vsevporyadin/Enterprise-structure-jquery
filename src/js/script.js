$(document).ready(function () {

	$('#data').jstree({
		'core' : {
			'data' : [
				{
					"text":"ООО Предприятие",
					"state":{
						"opened":true,
						"selected":true
					}
				}
			],
			'animation': 300,
			'check_callback': true,
			'multiple': false,
			'themes' : {
				'icons' : false
			},
			'check_callback' : true
		},
		'types' : {
			'#' : {
				'max_depth': 8
			}
		},
		'contextmenu': {
			'select_node': true,
			'items': reportMenu
		},
		'search': {
			'case_insensitive': true,
			'show_only_matches': true
		},
		'plugins' : ['dnd', 'search', 'themes', 'contextmenu', 'types']
	}).on('changed.jstree', function (e, data) {
		$('#j1_1 > i.jstree-ocl').remove();
		$('#j1_1 > #j1_1_anchor').css({'margin-left':'5px', 'margin-top':'10px'});
	});

	function reportMenu(node) {
		
		 $(document).on('contextmenu', '.jstree-anchor', function(e) {
		 e.preventDefault();
		 
		 var parentOffset = $(this).offset(); 
		 var relX = e.pageX;
		 var relY = e.pageY;
		
		 $('.context-menu').addClass('open').css({
		 left: relX,
		 top: relY
		 });

		 return false;
	 	});
	 
		$(document).on('click contextmenu', function() {
			$('.context-menu').removeClass('open');
		});

	}

	$('#OpenAll').click( function() {
		$('#data').jstree("open_all");
	})

	$('#RollUp').click( function(data) {
		$("#data li").each(function() {
			var node = $("#data").jstree().get_node(this.id);
			var level = node.parents.length;
			if(level>=2){
				$("#data").jstree().close_node({"id":node.id});
			}
		})
	})
	
	$('#createForlder').on('click', create_node);
	
	function create_node() {
		var ref = $('#data').jstree(true),
			sel = ref.get_selected();
		if(!sel.length) { sel[0] = '#'; }
		sel = sel[0];
		sel = ref.create_node(sel, {"text" : "Новый отдел"}, 'last');
		$('#j1_1 > i.jstree-ocl').remove();
		$('#j1_1 > #j1_1_anchor').css({'margin-left':'5px', 'margin-top':'10px'});
		if(sel) {
		ref.edit(sel);
		}
	}

	$('#renameForlder').on('click', rename_node);
	
	function rename_node() {
		var ref = $('#data').jstree(true),
			sel = ref.get_selected();
		if(!sel.length) { return false; }
		sel = sel[0];
		ref.edit(sel);
	 };
	
	$('#deleteForlder').on('click', delete_node);
 
	function delete_node() {
		var ref = $('#data').jstree(true),
		sel = ref.get_selected();
		prt=ref.get_parent(sel);
		ref.select_node(prt);
		if(!sel.length) { return false; }
		ref.delete_node(sel);
	};
	
	$(".search-input").keyup(function () {
		var searchString = $(this).val();
		$('#data').jstree('search', searchString);
	});
	
	$('#data')
		.on('changed.jstree', function (e, data) {
		var objNode = data.instance.get_node(data.selected);
		$('#jstree-result').html(objNode.text);
		$('#list-pool').html(objNode.text);
		$('#dep-re-input').val(objNode.text);
	})

	 $('#data').on('changed.jstree',function() {
	 	$( ".window" ).show('fast');
	 });

	 //Modall

	$('body').on('show.bs.modal',"#exampleModalCenter", function (event){

		$(function(){	
				$.getJSON('./src/api/example.json',function(result){
					var arr1 = [];
					$('#lstBox5 option').each(function(i, v){
						arr1.push(parseInt(v.value));
					});
					var selectOptions=[];
					$.each(result, function(i,select) {
						// var sticker='';
						if($.inArray(parseInt(select.id),arr1)==-1){
							sticker= select.sel;
							seltool= select.tool;
							selcol= select.col;
							selectOptions.push('<option data-tooltip="'+sticker+'" class="'+select.tool+'" value="'+select.id+'">'+select.name+' '+select.lastname+'</option>');	
						}
					});
					var htmloption=selectOptions.join('');
					$('.getjsonlist').html(htmloption);
					$('.selectpicker').selectpicker('refresh');
				});
		});
		
	})

	$(function(){	
		$.getJSON('./src/api/example.json',function(result){
			var arr1 = [];
			$('#lstBox6 option').each(function(i, v){
				arr1.push(parseInt(v.value));
			});
			var selectOptions=[];
			$.each(result, function(i,select) {
				var sticker='';
				if(parseInt(select.r)==1){
					sticker= select.sel;
					selectOptions.push("<option data-subtext='"+sticker+"' value='"+select.id+"'>"+select.name+" "+select.lastname+"</option>");
				}
			});
			var htmloption=selectOptions.join('');
				$('.selectpicker').html(htmloption);
				$('.selectpicker').selectpicker('refresh');
		});
	});

	$('#exampleModalCenter').on('hidden.bs.modal', function (event){
		$("#modal-search1").val('');
		$("#modal-search2").val('');
	})

	//Panel Main User

	$('body').on('click','#ruck-btn-edit',function(){
		$( ".ruck-conf" ).addClass('d-none');
		$( ".ruck-edit" ).show();
		$('#lstBox6').selectpicker('toggle');
		$('.sotrud').css('height','calc(100% - 105px)');
	});

	$('body').on('click','#ruck-btn-edit',function(){
		$('body').one('click', function(e){
			if(!$(e.target).closest("#lstBox6").length){
				$( ".ruck-conf" ).removeClass('d-none');
				$( ".ruck-edit" ).hide();
				$('.sotrud').css('height','calc(100% - 95px)');
			}
		});
		$('.pencil-but').unbind('click');
	});

	$('body').on('click','.swal-button--cancel',function(){
		$(".swal-overlay").removeClass("swal-overlay--show-modal");
	});
	$('body').on('click','.swal-button--confirm',function(){
		$(".swal-overlay").removeClass("swal-overlay--show-modal");
		$("p#lstBox4").empty();
		$("div.swal-text").empty();
		$('#lstBox6').selectpicker('val','');
		$('#lstBox6').selectpicker('deselectAll');
		$( ".ruck-edit" ).show();
		$('.sotrud').css('height','calc(100% - 105px)');
		$( ".ruck-conf" ).addClass('d-none');
	});

	$(function () {
		$("#lstBox6").on("changed.bs.select", function(e, clickedIndex) {
			var selectedD = $(this).find('option:eq(' + clickedIndex + ')').text()
			$('#lstBox4').text(selectedD);
			$( ".ruck-conf" ).removeClass('d-none');
			$('.sotrud').css('height','calc(100% - 95px)');
			$( ".ruck-edit" ).hide();
			$('body').on('click','#ruck-btn-del',function(){
				swal({
					title: "Вы хотите удалить?",
					text: "...",
					buttons: ["Нет", "Да"],
					dangerMode: true,
				})
				$('.swal-text').text(selectedD);
			});
		});
	});

	$('body').on('click','#dep-re',function(){
		$( ".dep-name" ).hide();
		$( ".dep-btn-box" ).hide();
		$( "#dep-conf-btn" ).removeClass('d-none');
		$( "#dep-re-input" ).removeClass('d-none');
		$('#dep-re-input').select();
	});

	$('body').on('click','#dep-conf-btn',function(){
		var va=$( "#dep-re-input" ).val();
		$( ".dep-btn-box" ).show();
		$( ".dep-name" ).show();
		$( "#dep-conf-btn" ).addClass('d-none');
		$( "#dep-re-input" ).addClass('d-none');
		$('#jstree-result').text(va);
	});

	$('body').on('keyup','#dep-re-input',function(e){
		
			var tree = $('#data').parent().find(".jstree");
			var node = tree.jstree('get_selected');
			var up = $('#dep-re-input').val();
			tree.jstree(true).rename_node(node, up);
			if(e.which == 13) {
				$( ".dep-name" ).show();
				$( "#dep-conf-btn" ).addClass('d-none');
				$( ".dep-btn-box" ).show();
				$( "#dep-re-input" ).addClass('d-none');
				$('#jstree-result').html(up);
			}

	});

	//Panel User panel-title

	$("#modal-search1").on("keyup", function () {
		var value = $(this).val().toLowerCase();
		$("#lstBox5 option").filter(function () {
		$(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
		});
	});

	$("#modal-search2").on("keyup", function () {
		var value = $(this).val().toLowerCase();
		$("#lstBox1 option").filter(function () {
		$(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
		});
	});


	$('body').on('click','.clop',function(){
		var pid=$(this).attr('id');
		var valyz=$(this).val();
		$('.clop option').each(function(ino,vao){
			if(parseInt(valyz)==parseInt(vao.value)){
				if(pid=='lstBox5'){
				$('#lstBox1').append('<option value="'+valyz+'">'+vao.innerHTML+'</option>');
				$('#lstBox3').append('<option value="'+valyz+'">'+vao.innerHTML+'</option>');
				$(this).remove();
				}
				else{
				$('#lstBox5').append('<option value="'+valyz+'">'+vao.innerHTML+'</option>');
				$(this).remove();
				}
			}
		});
	});
	
	$('body').on('click','.clop3',function(){
		var pid=$(this).attr('id');
		var valyz=$(this).val();
		$('.clop3 option').each(function(ino,vao){
			if(parseInt(valyz)==parseInt(vao.value)){
				if(pid=='lstBox1'){
					$('#lstBox5').append('<option value="'+valyz+'">'+vao.innerHTML+'</option>');
					$(this).remove();
				}
			}
		});
	});
	
	$('body').on('click','.clop3',function(){
		var selectedOpts = $('#lstBox1 option');
			$('#lstBox3').html('');
			$('#lstBox3').append($(selectedOpts).clone());
	});

	$('.circle').on('click',function(){
		var animClass = $(this).data('animation');
		var removeTime = $(this).data('remove');
		if($(this).hasClass(animClass)){
			 $(this).removeClass(animClass);
		}else{
			$(this).addClass(animClass);
			if(typeof removeTime != 'undefined'){
				var el = $(this);
				 setTimeout(function(){
					 el.removeClass(animClass);
				 },removeTime);
			}
		}
	});

});