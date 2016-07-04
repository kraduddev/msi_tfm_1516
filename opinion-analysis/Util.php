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

		if ($diff >= 0){
			if ($diff >= 0 && $diff <= 0.25){
				return "#e5ffe5";
			}
			if ($diff > 0.25 && $diff <= 0.5){
				return "#b2ffb2";
			}
			if ($diff > 0.5 && $diff <= 0.75){
				return "#66ff66";
			}
			else{
				return "#00ff00";
			}
		}
		else{
			if ($diff < 0 && $diff >= -0.25){
				return "#ffe5e5";
			}
			if ($diff < -0.25 && $diff >= -0.5){
				return "#ffb2b2";
			}
			if ($diff < -0.5 && $diff >= -0.75){
				return "#ff6666";
			}
			else{
				return "#ff0000";
			}
		}
	}
}
?>

