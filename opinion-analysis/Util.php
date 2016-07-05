<?php
class Util {
	public function hex_color_mod($hex, $diff) {
		/*$diff = number_format($diff,100,',','');
		$rgb = str_split(trim($hex, '# '), 2);

		foreach ($rgb as $key => &$hex) {

			$dec = hexdec($hex);
			if ($diff >= 0) {
				$dec -= $diff;
			}
			else {
				$dec -= abs($diff);			
			}
			$dec = max(0, min(255, $dec));
			$hex = str_pad(dechex($dec), 2, '0', STR_PAD_LEFT);
		}
var_dump($rgb);
		return '#'.implode($rgb);*/
		$max = 1;
		$min = -1;

		if ($diff == 0){
			return "#6666ff";
		}

		if ($diff > 0){
			if ($diff > 0 && $diff <= 0.25){
				return "#b2ffb2";//"#e5ffe5";
			}
			else if ($diff > 0.25 && $diff <= 0.5){
				return "#66ff66";//"#b2ffb2";
			}
			else if ($diff > 0.5 && $diff <= 0.75){
				return "#00ff00";//"#66ff66";
			}
			else if ($diff > 0.75){
				return "#00b200";//"#00ff00";
			}
		}
		else if($diff < 0){
			if ($diff < 0 && $diff >= -0.25){
				return "#ffb2b2";//"#ffe5e5";
			}
			else if ($diff < -0.25 && $diff >= -0.5){
				return "#ff6666";//"#ffb2b2";
			}
			else if ($diff < -0.5 && $diff >= -0.75){
				return "#ff0000";//"#ff6666";
			}
			else if($diff < -0.75){
				return "#b20000";//"#ff0000";
			}
		}
	}
}
?>

