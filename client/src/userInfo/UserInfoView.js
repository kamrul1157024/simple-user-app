export const UserInfoView = ({ userInfo, showUserInfoAs, showButtonAs }) => {
    const { firstName, lastName, emailAddress, mobileNo } = userInfo
    return (
        <div className="container">
            <span className="user-info"> User Info</span>
            <span className="details">
                <span className="info-name">First name: </span>
                {showUserInfoAs(firstName, 'firstName')}
            </span>
            <span className="details">
                <span className="info-name">Last name: </span>
                {showUserInfoAs(lastName, 'lastName')}
            </span>
            <span className="details">
                <span className="info-name">Email Address: </span>
                {showUserInfoAs(emailAddress, 'emailAddress')}
            </span>
            <span className="details">
                <span className="info-name">Mobile No: </span>
                {showUserInfoAs(mobileNo, 'mobileNo')}
            </span>
            {showButtonAs()}
        </div>
    )
}