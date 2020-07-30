<template>
	<baseLayout>
		<div slot="mainEntry" class="main-wrapper">
			<top-layout :showBack="false" />
			<el-row class="famous-row">
				<el-col :span="24">
					<vue-transform-effect
						v-show="showEffect"
						style="width: 60%; height: 120px; z-index: 0;"
						:baseSize="10"
					/>
					<el-card shadow="hover">
						<p>
							<font-awesome-icon icon="book" class="icon" />&nbsp;<span class="famous-text">{{
								displayText
							}}</span>
						</p>
						<div class="card-b">
							<span style="text-align: left;">
								<font-awesome-icon icon="tags" class="icon" style="font-size: 24px;" />
							</span>
							<el-button
								type="primary"
								round
								@click.stop="$store.commit('famous/DEL_ONE', displayText)"
								size="mini"
								class="f-btn"
								>下一条言语
							</el-button>
						</div>
					</el-card>
				</el-col>
			</el-row>
			<main-card ref="cardCom" />
		</div>
	</baseLayout>
</template>

<script>
import baseLayout from 'components/common/baseLayout';
import topLayout from 'components/common/topLayout';
import mainCard from 'components/mainEntry/mainCard';

export default {
	name: 'mainEntry',
	components: {
		baseLayout,
		topLayout,
		mainCard,
	},
	created() {
		this.getFamousData();
	},
	beforeRouteEnter(to, from, next) {
		next((vm) => (vm.$store.commit('EDIT_METANAME', ''), vm.$store.commit('EDIT_MENUINDEX', '1')));
	},
	methods: {
		async getFamousData() {
			await this.$store.dispatch('famous/getData');
		},
	},
	computed: {
		showEffect() {
			return this.$store.state.showEffect;
		},
		displayText() {
			const famous = this.$store.state.famous.text;
			famous.length <= 1 && this.getFamousData();
			return famous[(famous.length * Math.random()) | 0];
		},
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
@import '~@/assets/css/index';
@import '~@/assets/css/font';

.main-wrapper {
	.famous-row {
		background-color: @main-color;

		.famous-text {
			font: 19px/19px FzCzyksj;
		}

		.icon {
			color: @main-color;
		}

		.card-b {
			position: relative;
			display: flex;
			justify-content: space-between;
			z-index: 1;

			.f-btn {
				text-align: right;
				background-color: @main-color;
				border-color: @main-color;
			}
		}
	}

	.span-weight {
		color: #333;
		font-size: 1.25em;
	}

	img {
		border-radius: 8px;
	}

	.weather-desc {
		padding: 6px;
		color: #999;
		text-align: left;
	}

	.el-calendar-table .el-calendar-day {
		height: auto;
		padding: 0;
		line-height: 50px;
	}
}
</style>
