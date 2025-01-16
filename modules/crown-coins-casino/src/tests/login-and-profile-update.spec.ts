import { expect, test } from "../fixtures/base";
import { CoinType } from "../types/coin";
import { generateUser } from "../types/user";
import { logger } from "../utils/logger";

test.describe('Login and Profile Update Scenarios', () => {
    test('User logs in, updates profile, and checks coin balance', async ({ config, homePage, lobbyPage }) => {
        const user = generateUser();
        await homePage.goTo(config.BASE_URL);
        await homePage.clickLoginBtn();
        await homePage.loginComponent.login(user);
        await lobbyPage.subscribeToLobby();
        await lobbyPage.openMenu();
        await lobbyPage.clickOnMyAccount();
        await lobbyPage.myAccountComponent.clickOnMyProfile();
        await lobbyPage.myProfileComponent.editProfile();
        await lobbyPage.editProfileComponent.fillUsername(user.username);
        await lobbyPage.editProfileComponent.selectRandomAvatar();
        await lobbyPage.editProfileComponent.applyChanges();
        await lobbyPage.myAccountComponent.clickOnMyProfile();
        const username = await lobbyPage.myProfileComponent.extractUsername();
        expect(username).toEqual(user.username);
        await lobbyPage.myProfileComponent.closeMyProfilePopup();
        await lobbyPage.editProfileComponent.closeEditProfilePopup();
        await lobbyPage.myAccountComponent.closeMyAccountPopup();
        const socialCoinBalance = await homePage.extractBalance();
        logger.info(`Balance: ${socialCoinBalance} with coin type: ${CoinType.Social}`);
        await homePage.switchCoinType();
        const sweepCoinBalance = await homePage.extractBalance();
        logger.info(`Balance: ${sweepCoinBalance} with coin type: ${CoinType.Sweep}`);
    });
});
