import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectAuthState } from "../../store/authSlice";

const Users = () => {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);

	const router = useRouter();

	const user = useSelector(selectAuthState);
	if (!user.roles.includes("Admin")) {
		router.push("/login");
		return <h1>Not authorized</h1>;
	}

	useEffect(() => {
		const fetchProducts = async () => {
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
					console.log(data);
				}
			} catch (err) {
				alert(err);
				setError(true);
			} finally {
				setLoading(false);
			}
		};

		fetchProducts();
	}, []);

	return (
		<div>
			<h1>Users</h1>
			<ul>
				{users?.map(user => (
					<li key={user.id}>
						<div>
							<h3>Email: {user.email}</h3>
							<p>Id: {user.userId}</p>
							<p>Password as hash: {user.password}</p>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};

module.exports = Users;
