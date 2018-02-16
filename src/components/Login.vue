<template>
	<div class="info">
		<div class="logo">
			<img src="../assets/yinzi.jpg" alt="">
		</div>
		<el-form ref="loginFrom" :rules="rules" :model="form" class="container">
			<div class="userInfo">
				<el-form-item prop="username">
					<el-input prefix-icon="myicon myicon-user" v-model="form.username"></el-input>
				</el-form-item>
				<el-form-item prop="password">
					<el-input prefix-icon="myicon myicon-key" type="password" v-model="form.password"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" class="btn" @click="loginBtn">登录</el-button>
				</el-form-item>
			</div>
		</el-form>
	</div>
</template>

<script>
import { login } from "../api/api.js";
export default {
  data() {
    return {
      	form: {
			username: "", // 输入的用户名
			password: "" // 输入的密码
      	},
		rules: {
			username: [
				{ required: true, message: '请输入您的用户名', tigger: 'blur' }
			],
			password: [
				{ required: true, message: '请输入您的密码', tigger: 'blur' }
			]
		}
    };
  },
  methods: {
    loginBtn() {
		this.$refs['loginFrom'].validate(valid => {
			if(valid) {
				let params = {
					username: this.form.username,
					password: this.form.password
				};

				login(params).then(res => {
					console.log(res);
					if (res.meta.status === 200) {
						localStorage.setItem("mytoken", res.data.token);
						this.$router.push({ name: "home" });
					} else {
						this.$message({
							message: res.meta.msg,
							type: 'error'
						});
					}
				});
				}
			})
	  	}	
	}
}

</script>

<style scoped>
	.info {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		box-sizing: border-box;
		background-color: #2f4050;
	}
	.container {
		box-sizing: border-box;
		margin: 180px auto 0;
		width: 500px;
		height: 340px;
		background-color: #fff;
		position: relative;
	}
	.logo {
		position: absolute;
		left: 50%;
		top: 110px;
		width: 120px;
		height: 120px;
		border: 10px solid #fff;
		margin-left: -70px;
		border-radius: 50%;
		box-shadow: 0 1px 5px #ccc;
		background-color: pink;
		background-size: cover;
		overflow: hidden;
		z-index: 9999;
	}
	.logo img {
		width: 120px;
		height: 120px;
	}
	.userInfo {
		position: absolute;
		text-align: center;
		width: 400px;
		margin: 100px 50px;
	}
	.btn {
		width: 400px;
	}
	/*.el-form-item {
		color: blue;
	}*/
	.el-form-item__error {
		color: blue;
	}
</style>


