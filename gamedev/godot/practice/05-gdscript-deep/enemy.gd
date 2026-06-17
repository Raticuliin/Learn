class_name Enemy
extends RefCounted

var hp: int
var speed: float

func _init(hp: int, speed: float) -> void:   # constructor
	self.hp = hp
	self.speed = speed

func is_alive() -> bool:
	return hp > 0
