-include .env

.PHONY: all test clean deploy help install snapshot format anvil 

# الأوامر الأساسية
build:; forge build
clean:; forge clean
format:; forge fmt

# أوامر الاختبار (Testing)
test:; forge test
test-v:; forge test -vvv # بيطلع تفاصيل أكتر لو في إيرور
test-gas:; forge test --gas-report # بيطلع تقرير باستهلاك الغاز
snapshot:; forge snapshot # بيعمل تقرير باستهلاك الغاز لكل الدوال

# تشغيل شبكة محلية
anvil:; anvil -m 'test test test test test test test test test test test junk' --steps-tracing --block-time 1

# تحديث وتنزيل المكتبات
update:; forge update
install:; forge install OpenZeppelin/openzeppelin-contracts --no-commit

# أمر افتراضي للنشر على شبكة Sepolia (هنحتاجه قدام)
# بيعتمد على وجود ملف سكريبت اسمه Deploy.s.sol وملف .env فيه المتغيرات
deploy-sepolia:
	forge script script/Deploy.s.sol:Deploy --rpc-url $(SEPOLIA_RPC_URL) --private-key $(PRIVATE_KEY) --broadcast --verify --etherscan-api-key $(ETHERSCAN_API_KEY) -vvvv