'use client'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { InboxNotification, InboxNotificationList, LiveblocksUIConfig } from "@liveblocks/react-ui"
import { useInboxNotifications, useUnreadInboxNotificationsCount } from "@liveblocks/react/suspense"
import Image from "next/image"
import { ReactNode } from "react"

const Notifications = () => {
  const { inboxNotifications } = useInboxNotifications();
  const { count } = useUnreadInboxNotificationsCount();

  const unreadNotifications = inboxNotifications.filter((notification) => !notification.readAt);

  return (
    <Popover>
      <PopoverTrigger className="relative flex size-10 items-center justify-center rounded-lg">
        <Image
          src="/assets/icons/business.svg"
          alt="inbox"
          width={36}
          height={36}
        />
        {count > 0 && (
          <div className="absolute right-2 top-2 z-20 size-2 rounded-full bg-blue-500" />
        )}
      </PopoverTrigger>
      <PopoverContent align="end" className="shad-popover">
        <LiveblocksUIConfig
          overrides={{
            /*
            This is an override for the INBOX_NOTIFICATION_TEXT_MENTION key in the 
            LiveblocksUIConfig component. This override specifies a custom component 
            that will be rendered when displaying a notification that mentions the 
            current user.

            The custom component takes a single prop, `user`, which is a ReactNode 
            representing the username of the user who mentioned the current user.

            The custom component renders a simple string that says "{user} mentioned 
            you."

            The purpose of this override is to provide a more user-friendly 
            notification when someone mentions the current user in a comment or 
            message. The default behavior of Liveblocks is to display the 
            username of the user who mentioned the current user, but this can be 
            confusing if the current user doesn't know who the username refers to.

            By overriding the INBOX_NOTIFICATION_TEXT_MENTION key with this custom 
            component, we can provide a more intuitive and user-friendly 
            experience when someone mentions the current user.
            */

            INBOX_NOTIFICATION_TEXT_MENTION: (user: ReactNode) => (
              <>{user} mentioned you.</>
            )
          }}
        >
          <InboxNotificationList>
            {unreadNotifications.length <= 0 && (
              <p className="py-2 text-center text-dark-500">No new notifications.You are Up to Date</p>
            )}

            {unreadNotifications.length > 0 && unreadNotifications.map((notification) => (
              <InboxNotification
                key={notification.id}
                inboxNotification={notification}
                className="bg-dark-200 text-white"
                href={`/documents/${notification.roomId}`}
                showActions={false}
                kinds={{
                  /*
                  This is an override for the `thread` key in the `kinds` prop of
                  the `InboxNotificationList` component. This override specifies a
                  custom component that will be rendered when displaying a
                  notification that refers to a thread.

                  The custom component takes a single prop, `props`, which is an
                  object containing information about the notification, such as its
                  id, type, and the room that the thread belongs to.

                  The custom component renders an `InboxNotification.Thread`
                  component with the `props` object as its prop. The
                  `InboxNotification.Thread` component is a built-in Liveblocks
                  component that renders a thread notification.

                  We pass two additional props to the `InboxNotification.Thread`
                  component: `showActions` and `showRoomName`. Both of these props
                  are optional, and they control the appearance of the
                  notification. If `showActions` is set to `false`, the
                  notification will not display any actions (such as "Resolve" or
                  "Comment") that the user can perform on the thread. If
                  `showRoomName` is set to `false`, the notification will not
                  display the name of the room that the thread belongs to.

                  The purpose of this override is to customize the appearance of
                  thread notifications in the inbox. By default, Liveblocks
                  displays thread notifications with actions and the room name.
                  However, in our application, we want to simplify the
                  notification by hiding the actions and the room name. This
                  makes the notification more concise and easier to read.
                  */

                  thread: (props) => (
                    <InboxNotification.Thread {...props}
                      showActions={false}  // Hide actions (such as "Resolve" or "Comment")
                      showRoomName={false} // Hide the room name
                    />
                  ),

                  /*
                    This override specifies a custom component that will be
                    rendered when displaying a notification that mentions a
                    user. This type of notification is displayed in the inbox
                    when another user mentions you in a message or comment.

                    The custom component takes a single prop, `props`, which is an
                    object containing information about the notification, such as
                    its id, type, and the user that was mentioned.

                    The custom component renders an `InboxNotification.TextMention`
                    component with the `props` object as its prop. The
                    `InboxNotification.TextMention` component is a built-in Liveblocks
                    component that renders a mention notification.

                    We pass one additional prop to the `InboxNotification.TextMention`
                    component: `showRoomName`. This prop controls the appearance of
                    the notification. If `showRoomName` is set to `false`, the
                    notification will not display the name of the room that the
                    mention occurred in.

                    In this override, we set `showRoomName` to `false`, which means
                    that the custom notification will not display the room name.

                    The purpose of this override is to customize the appearance of
                    mention notifications in the inbox. By default, Liveblocks
                    displays mention notifications with the room name. However,
                    in our application, we want to simplify the notification by
                    hiding the room name. This makes the notification more concise
                    and easier to read.
                  */

                  textMention: (props) => (
                    <InboxNotification.TextMention {...props}
                      showRoomName={false} // Hide the room name
                    />
                  ),

                  /*
                    This custom notification component is used to display document
                    access notifications in the inbox.

                    The component takes a single prop, `props`, which is an object
                    containing information about the notification, such as its id,
                    type, and the user that was mentioned.

                    The component renders an `InboxNotification.Custom` component
                    with the `props` object as its prop. The `InboxNotification.Custom`
                    component is a built-in Liveblocks component that allows us to
                    customize the appearance of notifications.

                    Inside the component, we access the `title` property of the first
                    activity in the `inboxNotification.activities` array. This is the
                    title of the document that was shared.

                    We also access the `avatar` property of the first activity in the
                    `inboxNotification.activities` array. This is the avatar of the
                    user that shared the document.

                    We pass these two values as props to the `InboxNotification.Icon`
                    component. The `InboxNotification.Icon` component is a built-in
                    Liveblocks component that renders an icon. We set the `className`
                    prop to `bg-transparent` to ensure that the background of the
                    icon is transparent.

                    Inside the `InboxNotification.Icon` component, we render an `Image`
                    component from the Next.js library. We pass the `src`, `width`,
                    `height`, `alt`, and `className` props to the `Image` component.
                    The `src` prop is set to the value of the `avatar` prop. The
                    `width` and `height` props are set to 36. The `alt` prop is set to
                    `avatar`. The `className` prop is set to `rounded-full` to ensure
                    that the avatar is circular.

                    Finally, we pass the `props.children` to the `InboxNotification.Custom`
                    component. The `props.children` prop is the content of the
                    notification.
                  */

                  $documentAccess: (props) => (
                    <InboxNotification.Custom {...props} title={props.inboxNotification.activities[0].data.title} aside={<InboxNotification.Icon className="bg-transparent">
                      <Image
                        src={props.inboxNotification.activities[0].data.avatar as string || ''}
                        width={36}
                        height={36}
                        alt="avatar"
                        className="rounded-full"
                      />
                    </InboxNotification.Icon>}>
                      {props.children}
                    </InboxNotification.Custom>
                  )
                }}
              />
            ))}
          </InboxNotificationList>
        </LiveblocksUIConfig>
      </PopoverContent>
    </Popover>
  )
}

export default Notifications