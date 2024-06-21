export default function Profile() {

    const profileTemp = {
        name: 'Edrick Koda',
        bio: 'idk what',
        email: 'z12345@student.unsw.edu',
        profilePic: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/2048px-Windows_10_Default_Profile_Picture.svg.png'
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <div>
                <h1>Your Profile</h1>
            </div>
            <div> 
                <img 
                    src={profileTemp.profilePic} 
                    alt="Profile" 
                    style={{ 
                        width: '100px', 
                        height: '100px', 
                        borderRadius: '50%',
                    }} 
                />
            </div>
            <div>
                <h2>{profileTemp.name}</h2>
                <h3>{profileTemp.bio}</h3>
                <h3>{profileTemp.email}</h3>
            </div>
        
        </div>
    )
}