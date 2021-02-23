import { PropList, PropType } from '@casthub/types';

export default class extends window.casthub.card.trigger<{
    sub: boolean;
    resub: boolean;
    subgift: boolean;
    anonsubgift: boolean;
}> {
    async mounted(): Promise<void> {
        await super.mounted();

        const { id } = this.identity;
        const chat = await window.casthub.chat(id);

        chat.on('sub', ({ tags }) => {
            if (this.props.sub === false) {
                return;
            }

            this.newSub('sub', tags);
        });

        chat.on('resub', ({ tags }) => {
            if (this.props.resub === false) {
                return;
            }

            this.newSub('resub', tags);
        });

        chat.on('subgift', ({ tags }) => {
            if (this.props.subgift === false) {
                return;
            }

            this.newSub('subgift', tags);
        });

        chat.on('anonsubgift', ({ tags }) => {
            if (this.props.anonsubgift === false) {
                return;
            }

            this.newSub('anonsubgift', tags);
        });
    }

    newSub(type: string, data: any): void {
        let months = 0;

        if (parseInt(data['msg-param-months']) > 1) {
            months = parseInt(data['msg-param-months']);
        }

        this.trigger({
            subject: {
                id: data['user-id'],
                username: data['display-name'],
            },
            variables: {
                user: data['display-name'],
                plan: data['msg-param-sub-plan-name'],
                months,
            },
            meta: {
                event: type,
                data,
            },
        });
    }

    newSubGift(type: string, data: any): void {
        let id = null;
        let username = 'Anonymous';

        if (type !== 'anonsubgift') {
            id = data['user-id'];
            username = data['display-name'];
        }

        this.trigger({
            subject: {
                id,
                username,
            },
            variables: {
                user: username,
                target: data['msg-param-recipient-display-name'],
                months: data['msg-param-months'],
            },
            meta: {
                event: type,
                data,
            },
        });
    }

    async prepareProps(): Promise<PropList> {
        return {
            sub: {
                type: PropType.Toggle,
                label: 'Subscriptions',
                default: true,
            },
            resub: {
                type: PropType.Toggle,
                label: 'Resubscriptions',
                default: true,
            },
            subgift: {
                type: PropType.Toggle,
                label: 'Gifted Subscriptions',
                default: true,
            },
            anonsubgift: {
                type: PropType.Toggle,
                label: 'Gifted Subscriptions (Anonymous)',
                default: true,
            },
        };
    }
}
