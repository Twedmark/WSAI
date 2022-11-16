import { useRouter } from "next/router";
import React from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectAuthState } from "../../store/authSlice";
import styles from "./users.module.css";

type userFromDB = {
	userId: number;
	email: string;
	password: string;
	roles: string;
};

const Users = () => {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);

	const router = useRouter();

	const user = useSelector(selectAuthState);

	useEffect(() => {
		const fetchUsers = async () => {
			setLoading(true);
			try {
				const response = await fetch(
					"http://localhost:4000/getAllUsersWithRoles",
					{
						method: "GET",
						credentials: "include",
						headers: {
							"Content-Type": "application/json",
						},
					}
				);
				if (response.status === 200) {
					const data = await response.json();
					setUsers(data);
				}
			} catch (err) {
				alert(err);
				setError(true);
			} finally {
				setLoading(false);
			}
		};

		fetchUsers();
	}, []);

	useEffect(() => {
		if (user.isLoading === false && !user?.roles?.includes("SuperAdmin")) {
			router.push("/");
		}
	}, [user.isLoading]);

	async function removeRole(userId: number, role: string) {
		if (role === "User") {
			alert("Can't remove User role!");
			return;
		}
		if (userId === user.userId) {
			alert("Can't remove your own role!");
			return;
		}
		const response = await fetch("http://localhost:4000/removeRole", {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				userId,
				role,
			}),
		});
		if (response.status === 200) {
			const data = await response.json();
			setUsers(data);
		} else {
			alert("Something went wrong");
		}
	}

	async function addRole(userId: number, role: string) {
		const response = await fetch("http://localhost:4000/addRole", {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				userId,
				role,
			}),
		});
		if (response.status === 200) {
			const data = await response.json();
			setUsers(data);
		} else {
			alert("Something went wrong");
		}
	}

	async function deleteUser(userId: number) {
		if (userId === user.userId) {
			alert("Can't delete your own account!");
			return;
		}
		const response = await fetch("http://localhost:4000/deleteUser", {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				userId,
			}),
		});
		if (response.status === 200) {
			const data = await response.json();
			setUsers(data);
		} else {
			alert("Something went wrong");
		}
	}

	const placeholderRoles = ["User", "Admin", "SuperAdmin"];

	return (
		<div className={styles.usersContainer}>
			<h1>Users</h1>
			{loading && <p>Loading...</p>}
			{error && <p style={{ color: "red" }}>Error</p>}
			<ul className={styles.userList}>
				{users?.map((userInDb: userFromDB) => (
					<li key={userInDb.userId} className={styles.user}>
						<div>
							<button
								className={styles.deleteUser}
								onClick={() => deleteUser(userInDb.userId)}
							>
								🗑
							</button>
							<p>{userInDb.userId}</p>
							<h3>{userInDb.email}</h3>
							<div className={styles.roleContainer}>
								{userInDb.roles.split(",").map(role => {
									return (
										<span
											key={role}
											className={styles.role + " " + styles[role]}
											onClick={() => {
												removeRole(userInDb.userId, role);
											}}
										>
											{role}
										</span>
									);
								})}
							</div>
						</div>
						<div className={styles.placeholderRolesContainer}>
							{placeholderRoles
								.filter(role => !userInDb.roles.split(",").includes(role))
								.map(role => {
									return (
										<span
											key={role}
											className={styles.placeholderRole + " " + styles[role]}
											onClick={() => {
												addRole(userInDb.userId, role);
											}}
										>
											{role}
										</span>
									);
								})}
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};

module.exports = Users;
