Component({
    properties: {
        resource: {
            type: Array,
            value: [],
            observer: '_resourceChange'
        },
        invite: {
            type: Object,
            value: {},
            observer: '_inviteChange'
        },

        // use for floors' click report
        startIndex: { // start from 1
            type: Number,
            value: 1
        }
    },
    data: {
        floors: []
    },
    methods: {
        _resourceChange(resource) {
            let startIndex = this.data.startIndex;

            resource.forEach((val, index) => {
                val.floorIndex = startIndex + index;
            });

            this.setData({floors: resource});
        },
        _inviteChange(invite) {
            let floors = this.data.floors;

            floors.forEach(value => {
                if (value.template_name === 'editorTalk') {
                    value.data.invite = invite;
                }
            });

            this.setData({floors});
        },
        report(e) {
            this.triggerEvent('clickreport', e.detail);
        }
    }
});
