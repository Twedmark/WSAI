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

	return (
		<div>
			<h1>Users</h1>
			<ul>
				{users?.map((userInDb: userFromDB) => (
					<li key={userInDb.userId}>
						<div>
							<h3>Email: {userInDb.email}</h3>
							<p>Id: {userInDb.userId}</p>
							<p>Password as hash: {userInDb.password}</p>
							<p>
								Roles:{" "}
								{userInDb.roles.split(",").map(role => {
									return (
										<span
											className={styles.role + " " + styles[role]}
											onClick={() => {
												console.log(role);
											}}
										>
											{role}
										</span>
									);
								})}
							</p>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};

module.exports = Users;
