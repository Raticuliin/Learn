extends Node2D

# Módulo 5 · GDScript a fondo
# Todo corre en _ready() e imprime en la consola Output. Ejecuta con F6.
# Rellena cada bloque marcado con TODO.

# --- Parte 2: enum (lo declaramos a nivel de clase) ---
# declara aquí el enum State { IDLE, RUN, JUMP, DEAD }
enum State {IDLE, RUN, JUMP, DEAD}

func _ready() -> void:
	parte_1_colecciones()
	parte_2_match()
	parte_3_clases()
	parte_4_lambdas()
	parte_6_grupos()
	await parte_5_await()   # await porque countdown() espera de verdad


# --- Parte 1: colecciones tipadas ---
func parte_1_colecciones() -> void:
	# un Array[int] con 5 números y un Dictionary[String, int] con 3 pares.
	# Imprime el array y un valor del diccionario por su clave.
	var array: Array[int] = [1, 2, 3, 4, 5]
	var dictionary: Dictionary[String, int] = {"hola": 1, "Adios": 2, "Buenas": 3}
	
	print(array)
	print(dictionary.get("hola"))


# --- Parte 2: enum + match ---
func describe(state: State) -> String:
	# cambia el parámetro a tipo State y usa match:
	#   IDLE -> "quieto"; RUN y JUMP juntos -> "en movimiento"; _ -> "desconocido"
	
	match state:
		State.IDLE:
			return "quieto"
		State.RUN, State.JUMP:
			return "en movimiento"
		_:
			return "desconocido"

func parte_2_match() -> void:
	# llama a describe() con dos estados distintos e imprime el resultado.
	print(describe(State.JUMP))
	print(describe(State.DEAD))


# --- Parte 3: clases propias (van en sus propios archivos: enemy.gd, boss.gd) ---
func parte_3_clases() -> void:
	# crea un Enemy y un Boss con .new(...) e imprime si están vivos.
	
	var e := Enemy.new(100, 200)
	var b := Boss.new(0, 100, 2)
	
	print(e.is_alive())
	print(b.is_alive())


# --- Parte 4: lambdas ---
func parte_4_lambdas() -> void:
	var nums: Array[int] = [1, 2, 3, 4, 5]
	# map (duplicar), filter (pares), reduce (suma). Imprime los tres.
	
	print(nums.map(func(n): return n*2))
	print(nums.filter(func(n): return n%2 == 0))
	print(nums.reduce(func(acc, n): return acc + n, 0))
	
	# crea un Array de Enemy y ordénalo por hp con sort_custom. Imprímelo.
	var enemies := [Enemy.new(50, 1.0), Enemy.new(10, 1.0), Enemy.new(30, 1.0)]
	enemies.sort_custom(func(a, b): return a.hp < b.hp)
	
	for enemy in enemies:
		print(enemy)


# --- Parte 5: await ---
func parte_5_await() -> void:
	# imprime "3", "2", "1", "¡ya!" con 1s de espera entre cada uno (await).
	
	print("3")
	await get_tree().create_timer(1).timeout
	print("2")
	await get_tree().create_timer(1).timeout
	print("1")
	await get_tree().create_timer(1).timeout
	print("¡ya!")


# --- Parte 6: grupos ---
func parte_6_grupos() -> void:
	# crea 3 Node2D por código, add_child al Main y add_to_group("spawned").
	# Luego cuenta get_nodes_in_group("spawned") e imprímelo.
	var a: Node2D = Node2D.new()
	var b: Node2D = Node2D.new()
	var c: Node2D = Node2D.new()
	
	add_child(a)
	add_child(b)
	add_child(c)
	
	a.add_to_group("spawned")
	b.add_to_group("spawned")
	c.add_to_group("spawned")
	
	print(get_tree().get_nodes_in_group("spawned").size())

# --- Parte 7: pregunta de comprensión (responde aquí en 1-2 frases) ---
# ¿Por qué los Enemy de la parte 4 no pueden estar en el grupo de la parte 6?
# RESPUESTA: Porque tienen scopes diferentes
