extends Node2D

var score_p1: int = 0;
var score_p2: int = 0;

@onready var marcadorP1: Label = $MarcadorP1
@onready var marcadorP2: Label = $MarcadorP2

# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	update_marcadores()
	

func _on_pelota_score(player: int) -> void:
	if (player == 1):
		score_p1+=1
		update_marcadores()
	else:
		score_p2+=1
		update_marcadores()

func update_marcadores() -> void:
	marcadorP1.text = str(score_p1)
	marcadorP2.text = str(score_p2)
