import {
	RoomProvider,
	useOthers,
	useStorage,
	useMutation,
	useUpdateMyPresence,
} from "@/liveblocks.config";
import { ClientSideSuspense } from "@liveblocks/react";
import { LiveList } from "@liveblocks/client";
import { useEffect, useState } from "react";

const HomeRoot = () => {
	useEffect(() => {
		// Add browser notification
		if (Notification.permission !== "granted") {
			Notification.requestPermission();
		}
	}, []);

	return (
		<RoomProvider
			id={"nextjs-todo-list"}
			initialPresence={{ isTyping: false }}
			initialStorage={{ todos: new LiveList() }}
		>
			<ClientSideSuspense fallback={<p>Loading...</p>}>
				{() => <TodoList />}
			</ClientSideSuspense>
		</RoomProvider>
	);
};

export default HomeRoot;

const SomeoneIsTyping = () => {
	const someoneIsTyping = useOthers((others) =>
		others.some((other) => other.presence.isTyping)
	);

	return (
		<div className="someone_is_typing">
			{someoneIsTyping && "Someone is typing..."}
		</div>
	);
};

const WhoIsHere = () => {
	const userCount = useOthers((others) => others.length);

	return (
		<div className="who_is_here">
			There are {userCount} other users online
		</div>
	);
};

const TodoList = () => {
	const [draft, setDraft] = useState("");
	const updateMyPresence = useUpdateMyPresence();
	const todos = useStorage((root) => {
		console.log(root.todos);

		return root.todos;
	});

	// Listen to changes in the todos list

	const addTodo = useMutation(({ storage }, text) => {
		storage.get("todos").push({ text });
	}, []);

	const deleteTodo = useMutation(({ storage }, index) => {
		storage.get("todos").delete(index);
	}, []);

	return (
		<div className="container">
			<WhoIsHere />
			<input
				type="text"
				placeholder="What needs to be done?"
				value={draft}
				onChange={(e) => {
					setDraft(e.target.value);
					updateMyPresence({ isTyping: true });
				}}
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						updateMyPresence({ isTyping: false });
						addTodo(draft);
						setDraft("");
					}
				}}
				onBlur={() => updateMyPresence({ isTyping: false })}
			/>
			<SomeoneIsTyping />
			{todos.map((todo, index) => {
				return (
					<div key={index} className="todo_container">
						<div className="todo">{todo.text}</div>
						<button
							className="delete_button"
							onClick={() => deleteTodo(index)}
						>
							✕
						</button>
					</div>
				);
			})}
		</div>
	);
};
