import React from "react";
import {useShallow} from "zustand/react/shallow";
import {useIntl} from "react-intl";
import useUsers from "@store/users";
import Avatar, {Size} from "@components/avatar";
import Menu, {MenuTrigger} from "@components/menu";
import {useDisconnect} from "@store/auth";

const Profile: React.FC = () => {
    const {formatMessage} = useIntl();
    const {me, fetchMe} = useUsers(useShallow(({me, fetchMe}) => ({me, fetchMe})));
    const disconnect = useDisconnect();

    if (!me) {
        fetchMe();
        return null;
    }

    const handleDisconnect = (): void => disconnect();

    return (
        <Menu
            name="profile"
            placement="bottom-end"
            triggers={[MenuTrigger.CLICK, MenuTrigger.DISMISS]}
            button={(
                <button>
                    <Avatar
                        userId={me.id}
                        size={Size.S}
                        showTooltip={false}
                    />
                </button>
            )}
            items={[
                {
                    isDangerous: true,
                    leftDecorator: "leave",
                    text: formatMessage({
                        id: "components.profile_menu.disconnect",
                        defaultMessage: "Disconnect",
                    }),
                    onPress: handleDisconnect,
                },
            ]}
        />
    );
};

export default Profile;
