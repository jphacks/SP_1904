$(function() {
	$("form").submit(function() {
		// エラーの初期化
		$("p.error").remove();
		$("dl dd").removeClass("error");

		$("input[type='text'].validate,textarea.validate").each(function(){

			// 必須項目のチェック
			if($(this).hasClass("required")){
				if($(this).val()==""){
					$(this).parent().prepend("<p class='error'> 必須項目です </p>");
				}
			}

			// ラジオボタンのチェック
			$("input[type='radio'].validate.required").each(function(){
				if($("input[name" + $(this).attr("name") + "]:checked").length == 0){
					$(this).prepend("<p class='error'> 選択してください </p>");
				}
			});
		});
	})
});