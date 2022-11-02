import { useRouter } from "next/router";
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
			router.push("/login");
		}
	}, [user.isLoading]);

	function removeRole(userId: number, role: string) {
		console.log("removeRole " + role + " from user " + userId);
	}

	function addRole(userId: number, role: string) {
		console.log("addRole " + role + " to user " + userId);
	}

	const placeholderRoles = ["User", "Admin", "SuperAdmin"];

	return (
		<div>
			<h1>Users</h1>
			<ul className={styles.userList}>
				{users?.map((userInDb: userFromDB) => (
					<li key={userInDb.userId} className={styles.user}>
						<div>
							<p>{userInDb.userId}</p>
							<h3>{userInDb.email}</h3>
							<div className={styles.roleContainer}>
								{userInDb.roles.split(",").map(role => {
									return (
										<span
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
